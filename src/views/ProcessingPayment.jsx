import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import { 
  useGetProcessingPaymentsQuery, 
  useAddProcessingPaymentMutation, 
  useUpdateProcessingPaymentMutation 
} from '../store/services/processingPayment';

const ProcessingPayment = () => {
  const navigate = useNavigate();

  const { data: paymentsResponse, isLoading, isError, error } = useGetProcessingPaymentsQuery();
  const paymentReceivings = paymentsResponse || [];
  
  const [addProcessingPayment] = useAddProcessingPaymentMutation();
  const [updateProcessingPayment] = useUpdateProcessingPaymentMutation();

  const [formData, setFormData] = useState({
    date: '',
    party_id: '',
    processing_id: '',
    payment_mode: '',
    total_amount: 0,
    total_received: 0,
    total_balance: 0,
    to_account_id: '',
    amount: 0,
    details: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPaymentReceiving, setSelectedPaymentReceiving] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true, sm: 6 },
    { name: 'party_id', label: 'Party', type: 'select', options: [
      { value: '', label: 'Please select' },
      { value: 1, label: 'Test Party' }
    ], required: true, sm: 6 },
    { name: 'processing_id', label: 'Processing', type: 'select', options: [
      { value: '', label: 'Please select' },
      { value: 2, label: 'Test processing' }
    ], required: true, sm: 6 },
    { name: 'payment_mode', label: 'Payment Mode', type: 'select', options: [
      { value: '', label: 'Please select' },
      { value: 'cash', label: 'Cash' },
      { value: 'cheque', label: 'Cheque' }
    ], required: true, sm: 6 },
    { name: 'total_amount', label: 'Total Amount', type: 'number', required: true, sm: 6 },
    { name: 'total_received', label: 'Total Received', type: 'number', sm: 6, disabled: true },
    { name: 'total_balance', label: 'Total Balance', type: 'number', sm: 6, disabled: true },
    { name: 'to_account_id', label: 'To Account', type: 'select', options: [
      { value: '', label: 'Please select' },
      { value: '1', label: 'Cash in hand' }
    ], sm: 6 },
    { name: 'amount', label: 'Amount', type: 'number', required: true, sm: 6 },
    { name: 'details', label: 'Details', multiline: true, rows: 2 },
  ];

  const viewFields = [
    { name: 'date', label: 'Date' },
    { name: 'party', label: 'Party', render: (data) => (data.party ? data.party.name : '') },
    { name: 'processing', label: 'Processing', render: (data) => (data.processing ? data.processing.description : '') },
    { name: 'payment_mode', label: 'Payment Mode' },
    { name: 'total_amount', label: 'Total Amount' },
    { name: 'total_received', label: 'Total Received' },
    { name: 'total_balance', label: 'Total Balance' },
    { name: 'to_account', label: 'To Account', render: (data) => (data.to_account ? data.to_account.account_name : '') },
    { name: 'amount', label: 'Amount' },
    { name: 'details', label: 'Details' },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Date' },
    { 
      id: 'party', 
      label: 'Party', 
      render: (row) => row.party ? row.party.name : '' 
    },
    { 
      id: 'processing', 
      label: 'Processing', 
      render: (row) => row.processing ? row.processing.description : '' 
    },
    { id: 'payment_mode', label: 'Payment Mode' },
    { 
      id: 'to_account', 
      label: 'To Account', 
      render: (row) => row.to_account ? row.to_account.account_name : '' 
    },
    { id: 'amount', label: 'Amount' },
  ];

  const handleChangePage = (event, newPage) => { setPage(newPage); };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, paymentReceiving = null) => {
    setModalMode(mode);
    setSelectedPaymentReceiving(paymentReceiving);
    if (paymentReceiving) {
      setFormData(paymentReceiving);
    } else {
      setFormData({
        date: '',
        party_id: '',
        processing_id: '',
        payment_mode: '',
        total_amount: 0,
        total_received: 0,
        total_balance: 0,
        to_account_id: '',
        amount: 0,
        details: '',
      });
    }
    if (mode !== 'view') {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPaymentReceiving(null);
    if (modalMode === 'view') {
      navigate('/processing-payment');
    }
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        date: '',
        party_id: '',
        processing_id: '',
        payment_mode: '',
        total_amount: 0,
        total_received: 0,
        total_balance: 0,
        to_account_id: '',
        amount: 0,
        details: '',
      });
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      addProcessingPayment(formData)
        .unwrap()
        .then(() => handleCloseModal());
    } else if (modalMode === 'edit') {
      updateProcessingPayment(formData)
        .unwrap()
        .then(() => handleCloseModal());
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (isError) {
    return (
      <Typography color="error">
        Error fetching payment receivings: {error?.data?.message || error?.message || 'An unexpected error occurred.'}
      </Typography>
    );
  }

  return (
    <Box>
      {modalMode === 'view' && selectedPaymentReceiving ? (
        <>
          <ViewDetails
            data={selectedPaymentReceiving}
            title={`Payment Receiving [${selectedPaymentReceiving.id}]`}
            detailsRef={detailsRef}
            fields={viewFields}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/processing-payment')}>
              Back to list
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Processing Payment Receivings</Typography>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => handleOpenModal('add')}>
              Add new
            </Button>
          </Box>
          <SharedTable
            columns={columns}
            data={paymentReceivings}
            onEdit={(paymentReceiving) => {
              tableRef.current = null;
              handleOpenModal('edit', paymentReceiving);
            }}
            onView={(paymentReceiving) => {
              tableRef.current = null;
              handleOpenModal('view', paymentReceiving);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={paymentReceivings.length}
            tableRef={tableRef}
          />
        </>
      )}
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Processing Payment Receivings, Add new'
            : modalMode === 'edit'
            ? 'Edit Payment Receiving'
            : 'View Payment Receiving'
        }
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        mode={modalMode}
        fields={fields}
      />
    </Box>
  );
};

export default ProcessingPayment;