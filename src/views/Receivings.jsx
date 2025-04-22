import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useGetReceivingsQuery, useAddReceivingMutation, useUpdateReceivingMutation } from '../store/services/receivings';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import ReceivingDetailsTable from '../components/ReceivingDetailsTable';
import { useNavigate } from 'react-router-dom';

const Receivings = () => {
  const navigate = useNavigate();
  const { data: receivings, isLoading } = useGetReceivingsQuery();
  const [addReceiving] = useAddReceivingMutation();
  const [updateReceiving] = useUpdateReceivingMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedReceiving, setSelectedReceiving] = useState(null);
  const [formData, setFormData] = useState({
    lot_number: '',
    arrival_date: '',
    party: '',
    receiving_type: '',
    file_number: '',
    remarks: '',
    total: 0.0,
    discount_percent: 0.0,
    grand_total: 0.0,
    active: true,
    details: [],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const fields = [
    { name: 'lot_number', label: 'Lot Number', required: true, sm: 6 },
    { name: 'arrival_date', label: 'Arrival Date', type: 'date', required: true, sm: 6 },
    {
      name: 'party',
      label: 'Party',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'SA Rice', label: 'SA Rice' },
        { value: 'All Commodities', label: 'All Commodities' },
      ],
      required: true,
      sm: 6,
    },
    {
      name: 'receiving_type',
      label: 'Receiving Type',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'Milling', label: 'Milling' },
      ],
      required: true,
      sm: 6,
    },
    { name: 'file_number', label: 'File Number', sm: 6 },
    { name: 'remarks', label: 'Remarks', multiline: true, rows: 2 },
    { name: 'total', label: 'Total (₹)', type: 'number', required: true, sm: 6 },
    { name: 'discount_percent', label: 'Discount (%)', type: 'number', required: true, sm: 6 },
    { name: 'grand_total', label: 'Grand Total (₹)', type: 'number', required: true, sm: 6 },
    { name: 'active', label: 'Is Active', type: 'checkbox' },
  ];

  const formatReceivingData = (receiving) => {
    return {
      ...receiving,
      party: receiving.party?.name || '',
      active: receiving.active === 1 || receiving.active === true,
    };
  };

  const columns = [
    { id: 'id', label: 'ID' },
    {
      id: 'arrival_date',
      label: 'Arrival Date',
      format: (value) => new Date(value).toLocaleDateString()
    },
    { id: 'party', label: 'Party' },
    { id: 'receiving_type', label: 'Receiving Type' },
    { id: 'lot_number', label: 'Lot #' },
    { id: 'file_number', label: 'File #' },
    { id: 'remarks', label: 'Remarks' },
    {
      id: 'total',
      label: 'Total (₹)',
      format: (value) => parseFloat(value).toFixed(2)
    },
    {
      id: 'discount_percent',
      label: 'Discount (%)',
      format: (value) => parseFloat(value).toFixed(2)
    },
    {
      id: 'grand_total',
      label: 'Grand Total (₹)',
      format: (value) => parseFloat(value).toFixed(2)
    },
    {
      id: 'active',
      label: 'Is Active',
      format: (value) => (value ? 'Yes' : 'No'),
    },
  ];

  const viewFields = [
    ...fields,
    { name: 'last_invoice_date', label: 'Last Invoice Date' },
    { name: 'next_invoice_date', label: 'Next Invoice Date' },
    { name: 'added_by', label: 'Added By' },
    { name: 'added_on', label: 'Added On' },
    { name: 'modified_by', label: 'Modified By' },
    { name: 'modified_on', label: 'Modified On' },
    { name: 'status', label: 'Status' },
  ];

  const subTableConfig = {
    tabs: [
      {
        label: 'Receiving Details',
        type: 'receivingDetails',
        dataKey: 'details',
      },
    ],
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, receiving = null) => {
    setModalMode(mode);
    setSelectedReceiving(receiving);
    if (receiving) {
      setFormData(formatReceivingData(receiving));
    } else {
      setFormData({
        lot_number: '',
        arrival_date: '',
        party: '',
        receiving_type: '',
        file_number: '',
        remarks: '',
        total: 0.0,
        discount_percent: 0.0,
        grand_total: 0.0,
        active: true,
        details: [],
      });
    }
    if (mode !== 'view') {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReceiving(null);
    if (modalMode === 'view') {
      navigate('/receivings');
    }
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        lot_number: '',
        arrival_date: '',
        party: '',
        receiving_type: '',
        file_number: '',
        remarks: '',
        total: 0.0,
        discount_percent: 0.0,
        grand_total: 0.0,
        active: true,
        details: [],
      });
    } else if (Array.isArray(e)) {
      setFormData((prev) => ({ ...prev, details: e }));
    } else {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = () => {
    const formattedData = {
      ...formData,
      active: formData.active ? 1 : 0,
      party_id: typeof formData.party === 'object' ? formData.party.id : null
    };

    if (modalMode === 'add') {
      addReceiving(formattedData);
    } else if (modalMode === 'edit') {
      updateReceiving({ ...formattedData, id: selectedReceiving.id });
    }
    handleCloseModal();
  };

  const renderReceivingDetails = ({ data, formData, onChange, isViewMode }) => (
    <ReceivingDetailsTable
      details={(data || formData)?.details || []}
      onChange={(updatedDetails) => onChange(updatedDetails)}
      isViewMode={isViewMode}
    />
  );

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {modalMode === 'view' && selectedReceiving ? (
        <>
          <ViewDetails
            data={formatReceivingData(selectedReceiving)}
            title={`Receiving Details - ID ${selectedReceiving.id}`}
            detailsRef={detailsRef}
            fields={viewFields}
            renderCustomContent={renderReceivingDetails}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/receivings')}>
              Back to Receiving List
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Receiving</Typography>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => handleOpenModal('add')}>
              Add New Receiving
            </Button>
          </Box>
          <SharedTable
            columns={columns}
            data={receivings?.map(formatReceivingData) || []}
            onEdit={(receiving) => {
              tableRef.current = null;
              handleOpenModal('edit', receiving);
            }}
            onView={(receiving) => {
              tableRef.current = null;
              handleOpenModal('view', receiving);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={receivings?.length || 0}
            tableRef={tableRef}
            subTableConfig={subTableConfig}
          />
        </>
      )}
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Add New Receiving'
            : modalMode === 'edit'
            ? 'Edit Receiving Details'
            : 'View Receiving Details'
        }
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        mode={modalMode}
        fields={fields}
        renderCustomContent={renderReceivingDetails}
      />
    </Box>
  );
};

export default Receivings;