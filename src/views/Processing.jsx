import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useGetProcessingsQuery, useAddProcessingMutation, useUpdateProcessingMutation } from '../store/services/processing';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import ProcessingOutTable from '../components/ProcessingOutTable';
import ProcessingInTable from '../components/ProcessingInTable';
import ProcessingExpensesTable from '../components/ProcessingExpensesTable';
import { useNavigate } from 'react-router-dom';

const mockProcessings = [
  {
    id: 161,
    date: '09/04/2025',
    party: 'SA Rice',
    description: '',
    chargesTotal: 271035.00,
    active: true,
    processingStatus: 'Unpaid',
    processingOut: [
      {
        lotNumber: '3005',
        date: '09/04/2025',
        location: 'SA GODOWN',
        product: '1121 Sella Raw',
        unit: 'Kg',
        availableQty: 0,
        qty: 1200,
        qtyLess: 0,
        availableWeight: 0,
        weight: 60290,
        weightLess: 60,
        type: 'processingOut',
      },
    ],
    processingIn: [
      {
        lotNumber: '4016',
        date: '09/04/2025',
        location: 'SA GODOWN',
        product: '1121 Sella B1 Mix',
        unit: 'Kg',
        qty: 7,
        rate: 0.00,
        amount: 0,
        weight: 350,
        productType: 'Byproduct',
        weightLess: 0,
        type: 'processingIn',
      },
    ],
    processingExpenses: [
      {
        chargesType: 'Processing Charges',
        details: '',
        qty: 1200,
        weight: 60230,
        rate: 4.5,
        amount: 271035.00,
        type: 'processingExpenses',
      },
    ],
    addedBy: 'Admin',
    addedOn: '09/04/2025 14:32:20',
    modifiedBy: 'Admin',
    modifiedOn: '09/04/2025 14:44:54',
  },
];

const Processing = () => {
  const navigate = useNavigate();
  // Comment out the real API call and use mock data
  // const { data: processings, isLoading, isError, error } = useGetProcessingsQuery();
  const processings = mockProcessings;
  const isLoading = false;
  const isError = false;
  const error = null;

  const [addProcessing] = useAddProcessingMutation();
  const [updateProcessing] = useUpdateProcessingMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'view'
  const [selectedProcessing, setSelectedProcessing] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    party: '',
    description: '',
    chargesTotal: 0.0,
    active: true,
    processingOut: [],
    processingIn: [],
    processingExpenses: [],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true, sm: 6 },
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
    { name: 'description', label: 'Description', multiline: true, rows: 2 },
    { name: 'chargesTotal', label: 'Charges Total (₹)', type: 'number', required: true, sm: 6 },
    { name: 'active', label: 'Active', type: 'checkbox' },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Date' },
    { id: 'party', label: 'Party' },
    { id: 'description', label: 'Description' },
    { id: 'chargesTotal', label: 'Charges Total (₹)' },
    {
      id: 'active',
      label: 'Active',
      format: (value) => (value ? 'Yes' : 'No'),
    },
    { id: 'processingStatus', label: 'Processing Status' },
  ];

  const viewFields = [
    ...fields,
    { name: 'addedBy', label: 'Added By' },
    { name: 'addedOn', label: 'Added On' },
    { name: 'modifiedBy', label: 'Modified By' },
    { name: 'modifiedOn', label: 'Modified On' },
    { name: 'processingStatus', label: 'Processing Status' },
  ];

  const subTableConfig = {
    tabs: [
      {
        label: 'Processing Out / Raw Material',
        type: 'processingOut',
        dataKey: 'processingOut',
      },
      {
        label: 'Processing In / Finished Products',
        type: 'processingIn',
        dataKey: 'processingIn',
      },
      {
        label: 'Processing Expenses',
        type: 'processingExpenses',
        dataKey: 'processingExpenses',
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

  const handleOpenModal = (mode, processing = null) => {
    setModalMode(mode);
    setSelectedProcessing(processing);
    if (processing) {
      setFormData(processing);
    } else {
      setFormData({
        date: '',
        party: '',
        description: '',
        chargesTotal: 0.0,
        active: true,
        processingOut: [],
        processingIn: [],
        processingExpenses: [],
      });
    }
    if (mode !== 'view') {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProcessing(null);
    if (modalMode === 'view') {
      navigate('/processing');
    }
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        date: '',
        party: '',
        description: '',
        chargesTotal: 0.0,
        active: true,
        processingOut: [],
        processingIn: [],
        processingExpenses: [],
      });
    } else if (Array.isArray(e)) {
      if (e[0]?.type === 'processingOut') {
        setFormData((prev) => ({ ...prev, processingOut: e }));
      } else if (e[0]?.type === 'processingIn') {
        setFormData((prev) => ({ ...prev, processingIn: e }));
      } else if (e[0]?.type === 'processingExpenses') {
        setFormData((prev) => ({ ...prev, processingExpenses: e }));
      }
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      addProcessing(formData);
    } else if (modalMode === 'edit') {
      updateProcessing({ ...formData, id: selectedProcessing.id });
    }
    handleCloseModal();
  };

  const renderProcessingOut = ({ data, formData, onChange, isViewMode }) => {
    const details = (data || formData)?.processingOut || [];
    console.log('ProcessingOut details:', details);
    return (
      <ProcessingOutTable
        details={details}
        onChange={(updatedDetails) => onChange(updatedDetails)}
        isViewMode={isViewMode}
      />
    );
  };

  const renderProcessingIn = ({ data, formData, onChange, isViewMode }) => {
    const details = (data || formData)?.processingIn || [];
    console.log('ProcessingIn details:', details);
    return (
      <ProcessingInTable
        details={details}
        onChange={(updatedDetails) => onChange(updatedDetails)}
        isViewMode={isViewMode}
      />
    );
  };

  const renderProcessingExpenses = ({ data, formData, onChange, isViewMode }) => {
    const details = (data || formData)?.processingExpenses || [];
    console.log('ProcessingExpenses details:', details);
    return (
      <ProcessingExpensesTable
        details={details}
        onChange={(updatedDetails) => onChange(updatedDetails)}
        isViewMode={isViewMode}
      />
    );
  };

  const renderCustomContent = (props) => (
    <>
      {renderProcessingOut(props)}
      {renderProcessingIn(props)}
      {renderProcessingExpenses(props)}
    </>
  );

  // Handle loading state
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  // Handle error state
  if (isError) {
    return (
      <Typography color="error">
        Error fetching processings: {error?.data?.message || error?.message || 'An unexpected error occurred.'}
      </Typography>
    );
  }

  // Ensure processings is defined before rendering the table
  const processingsData = processings || [];

  return (
    <Box>
      {modalMode === 'view' && selectedProcessing ? (
        <>
          <ViewDetails
            data={selectedProcessing}
            title={`Processing [${selectedProcessing.id}]`}
            detailsRef={detailsRef}
            fields={viewFields}
            renderCustomContent={renderCustomContent}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/processing')}>
              Back to list
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Processing</Typography>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => handleOpenModal('add')}
            >
              Add new
            </Button>
          </Box>
          <SharedTable
            columns={columns}
            data={processingsData}
            onEdit={(processing) => {
              tableRef.current = null;
              handleOpenModal('edit', processing);
            }}
            onView={(processing) => {
              tableRef.current = null;
              handleOpenModal('view', processing);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={processingsData.length}
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
            ? 'Processing, Add new'
            : modalMode === 'edit'
            ? 'Edit Processing'
            : 'View Processing'
        }
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        mode={modalMode}
        fields={fields}
        renderCustomContent={renderCustomContent}
      />
    </Box>
  );
};

export default Processing;