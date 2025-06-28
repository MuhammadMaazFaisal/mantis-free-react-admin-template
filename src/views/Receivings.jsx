import React, { useState, useRef } from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useGetReceivingsQuery, useAddReceivingMutation, useUpdateReceivingMutation } from '../store/services/receivings';
import { useGetPartiesQuery } from '../store/services/party';
import { useLocationsQuery } from '../store/services/settings';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import ReceivingDetailsTable from '../components/ReceivingDetailsTable';
import { useNavigate } from 'react-router-dom';

const Receivings = () => {
  const navigate = useNavigate();
  const { data: receivings, isLoading } = useGetReceivingsQuery();
  const { data: parties } = useGetPartiesQuery();
  const { data: locations } = useLocationsQuery();
  const [addReceiving] = useAddReceivingMutation();
  const [updateReceiving] = useUpdateReceivingMutation();

  const locationOptions = locations ? locations.map(l => ({ value: l.id, label: l.name })) : [];
  const partyOptions = parties ? parties.map(p => ({ value: p.id, label: p.name })) : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedReceiving, setSelectedReceiving] = useState(null);
  const [formData, setFormData] = useState({
    lot_number: '',
    arrival_date: '',
    party_id: '', // updated property name
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
      name: 'party_id', // updated property name
      label: 'Party',
      type: 'select',
      options: partyOptions, // dynamic dropdown options now
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
        { value: 'Purchase', label: 'Purchase' }, // added Purchase option
      ],
      required: true,
      sm: 6,
    },
    { name: 'file_number', label: 'File Number', sm: 6 },
    { name: 'remarks', label: 'Remarks', multiline: true, rows: 2 },
    { name: 'total', label: 'Total (Rs)', type: 'number', required: true, sm: 6 },
    { name: 'discount_percent', label: 'Discount (%)', type: 'number', required: true, sm: 6 },
    { name: 'grand_total', label: 'Grand Total (Rs)', type: 'number', required: true, sm: 6 },
    { name: 'active', label: 'Is Active', type: 'checkbox' },
    // Removed the main location field.
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
    // Removed location view field.
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

  const formatReceivingData = (receiving) => {
    return {
      ...receiving,
      // if full party info exists, use its name; otherwise fallback to party_id value
      party: receiving.party?.name || receiving.party_id || '',
      active: receiving.active === 1 || receiving.active === true,
      // Removed location formatting from top-level.
    };
  };

  const handleOpenModal = (mode, receiving = null) => {
    setModalMode(mode);
    setSelectedReceiving(receiving);
    if (receiving) {
      setFormData({
        ...formatReceivingData(receiving),
        party_id: receiving.party?.id || receiving.party_id || '',
        // Normalize details for edit/view mode
        details: (receiving.details || []).map(d => ({
          ...d,
          product: d.product || d.product_id || '',
          location: d.location || d.location_id || '',
          quantity: d.quantity ? parseFloat(d.quantity) : 0,
          weight: d.weight ? parseFloat(d.weight) : 0,
          rate: d.rate ? parseFloat(d.rate) : 0,
          amount: d.amount ? parseFloat(d.amount) : 0,
        })),
      });
    } else {
      setFormData({
        lot_number: '',
        arrival_date: '',
        party_id: '', // reset to empty for dynamic dropdown
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
    // Close view detail mode without navigation
    setModalOpen(false);
    setSelectedReceiving(null);
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        lot_number: '',
        arrival_date: '',
        party_id: '', // reset to empty for dynamic dropdown
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
    // Transform details to use "product_id", "location_id", and include "id" if present
    const transformedDetails = formData.details.map(detail => {
      // Try to extract location_id robustly
      let location_id = null;
      if (detail.location && typeof detail.location === 'object' && (detail.location.id || detail.location.value)) {
        location_id = detail.location.id || detail.location.value;
      } else if (typeof detail.location === 'number' || typeof detail.location === 'string') {
        location_id = detail.location;
      } else if (detail.location_id && typeof detail.location_id === 'object' && (detail.location_id.id || detail.location_id.value)) {
        location_id = detail.location_id.id || detail.location_id.value;
      } else if (typeof detail.location_id === 'number' || typeof detail.location_id === 'string') {
        location_id = detail.location_id;
      }

      let product_id = null;
      if (detail.product && typeof detail.product === 'object' && detail.product.id) {
        product_id = detail.product.id;
      } else if (typeof detail.product === 'number' || typeof detail.product === 'string') {
        product_id = detail.product;
      } else if (detail.product_id && typeof detail.product_id === 'object' && detail.product_id.id) {
        product_id = detail.product_id.id;
      } else if (typeof detail.product_id === 'number' || typeof detail.product_id === 'string') {
        product_id = detail.product_id;
      }

      // Include id if present (for editing existing details)
      const result = {
        product_id,
        location_id,
        quantity: detail.quantity,
        weight: detail.weight,
        rate: detail.rate,
        amount: detail.amount,
      };
      if (detail.id) {
        result.id = detail.id;
      }
      return result;
    });

    // Ensure every detail has location_id
    if (transformedDetails.some(d => !d.location_id)) {
      alert("Each detail row must have a location selected.");
      return;
    }

    if (transformedDetails.length === 0) {
      alert("Please provide at least one detail entry.");
      return;
    }

    const formattedData = {
      ...formData,
      active: formData.active ? 1 : 0,
      party_id: typeof formData.party_id === 'object' ? formData.party_id.id : formData.party_id || null,
      details: transformedDetails,
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
      // Pass location options for the dropdown beside the product dropdown.
      locationOptions={locationOptions}
    />
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
            <Button variant="outlined" onClick={handleCloseModal}>
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
            columns={[
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
                label: 'Total (Rs)',
                format: (value) => parseFloat(value).toFixed(2)
              },
              {
                id: 'discount_percent',
                label: 'Discount (%)',
                format: (value) => parseFloat(value).toFixed(2)
              },
              {
                id: 'grand_total',
                label: 'Grand Total (Rs)',
                format: (value) => parseFloat(value).toFixed(2)
              },
              {
                id: 'active',
                label: 'Is Active',
                format: (value) => (value ? 'Yes' : 'No'),
              },
              // Removed main location column.
            ]}
            data={(receivings?.map(formatReceivingData)) || []}
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