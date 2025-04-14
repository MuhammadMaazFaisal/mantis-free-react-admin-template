import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';

// Mock data for payment receivings
const mockPaymentReceivings = [
  {
    id: 27,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 31,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 261548.00,
    bankReference: '',
    totalAmount: 261548.00,
    totalReceived: 0,
    totalBalance: 261548.00,
    details: '',
  },
  {
    id: 26,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 30,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 375840.00,
    bankReference: '',
    totalAmount: 375840.00,
    totalReceived: 0,
    totalBalance: 375840.00,
    details: '',
  },
  {
    id: 25,
    date: '19/10/2023',
    party: 'Barkha Traders',
    processing: 29,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 116280.00,
    bankReference: '',
    totalAmount: 116280.00,
    totalReceived: 0,
    totalBalance: 116280.00,
    details: '',
  },
  // Add more mock entries as per the screenshot
  {
    id: 24,
    date: '19/10/2023',
    party: 'Barkha Traders',
    processing: 28,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 134811.00,
    bankReference: '',
    totalAmount: 134811.00,
    totalReceived: 0,
    totalBalance: 134811.00,
    details: '',
  },
  {
    id: 23,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 27,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 87294.00,
    bankReference: '',
    totalAmount: 87294.00,
    totalReceived: 0,
    totalBalance: 87294.00,
    details: '',
  },
  {
    id: 22,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 26,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 58940.00,
    bankReference: '',
    totalAmount: 58940.00,
    totalReceived: 0,
    totalBalance: 58940.00,
    details: '',
  },
  {
    id: 21,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 25,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 167276.00,
    bankReference: '',
    totalAmount: 167276.00,
    totalReceived: 0,
    totalBalance: 167276.00,
    details: '',
  },
  {
    id: 20,
    date: '19/10/2023',
    party: 'Zubair Enterprises',
    processing: 23,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 724786.86,
    bankReference: '',
    totalAmount: 724786.86,
    totalReceived: 0,
    totalBalance: 724786.86,
    details: '',
  },
  {
    id: 19,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 24,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 14000.00,
    bankReference: '',
    totalAmount: 14000.00,
    totalReceived: 0,
    totalBalance: 14000.00,
    details: '',
  },
  {
    id: 18,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 22,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 214854.00,
    bankReference: '',
    totalAmount: 214854.00,
    totalReceived: 0,
    totalBalance: 214854.00,
    details: '',
  },
  {
    id: 17,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 21,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 1015682.00,
    bankReference: '',
    totalAmount: 1015682.00,
    totalReceived: 0,
    totalBalance: 1015682.00,
    details: '',
  },
  {
    id: 16,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 20,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 166680.00,
    bankReference: '',
    totalAmount: 166680.00,
    totalReceived: 0,
    totalBalance: 166680.00,
    details: '',
  },
  {
    id: 15,
    date: '19/10/2023',
    party: 'Kataf Enterprises',
    processing: 19,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 171420.00,
    bankReference: '',
    totalAmount: 171420.00,
    totalReceived: 0,
    totalBalance: 171420.00,
    details: '',
  },
  {
    id: 14,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 18,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 232228.00,
    bankReference: '',
    totalAmount: 232228.00,
    totalReceived: 0,
    totalBalance: 232228.00,
    details: '',
  },
  {
    id: 13,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 17,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 824722.00,
    bankReference: '',
    totalAmount: 824722.00,
    totalReceived: 0,
    totalBalance: 824722.00,
    details: '',
  },
  {
    id: 12,
    date: '19/10/2023',
    party: 'SA Rice',
    processing: 16,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 107390.00,
    bankReference: '',
    totalAmount: 107390.00,
    totalReceived: 0,
    totalBalance: 107390.00,
    details: '',
  },
  {
    id: 11,
    date: '11/10/2023',
    party: 'SA Rice',
    processing: 15,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 203850.00,
    bankReference: '',
    totalAmount: 203850.00,
    totalReceived: 0,
    totalBalance: 203850.00,
    details: '',
  },
  {
    id: 10,
    date: '15/07/2023',
    party: 'SA Rice',
    processing: 14,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 1119160.00,
    bankReference: '',
    totalAmount: 1119160.00,
    totalReceived: 0,
    totalBalance: 1119160.00,
    details: '',
  },
  {
    id: 9,
    date: '15/07/2023',
    party: 'SA Rice',
    processing: 13,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 103845.00,
    bankReference: '',
    totalAmount: 103845.00,
    totalReceived: 0,
    totalBalance: 103845.00,
    details: '',
  },
  {
    id: 8,
    date: '15/07/2023',
    party: 'SA Rice',
    processing: 12,
    paymentMode: 'Cash',
    toAccount: 'Cash in hand',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    amount: 155057.00,
    bankReference: '',
    totalAmount: 155057.00,
    totalReceived: 0,
    totalBalance: 155057.00,
    details: '',
  },
];

const ProcessingPayment = () => {
  const navigate = useNavigate();

  // Use mock data instead of API for now
  const paymentReceivings = mockPaymentReceivings;
  const isLoading = false;
  const isError = false;
  const error = null;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'view'
  const [selectedPaymentReceiving, setSelectedPaymentReceiving] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    party: '',
    processing: '',
    paymentMode: '',
    totalAmount: 0,
    totalReceived: 0,
    totalBalance: 0,
    toAccount: '',
    chequeNo: '',
    chequeBank: '',
    chequeDate: '',
    amount: 0,
    bankReference: '',
    details: '',
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
        { value: 'Barkha Traders', label: 'Barkha Traders' },
        { value: 'Zubair Enterprises', label: 'Zubair Enterprises' },
        { value: 'Kataf Enterprises', label: 'Kataf Enterprises' },
      ],
      required: true,
      sm: 6,
    },
    {
      name: 'processing',
      label: 'Processing',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: '12', label: '12' },
        { value: '13', label: '13' },
        { value: '14', label: '14' },
        { value: '15', label: '15' },
        { value: '16', label: '16' },
        { value: '17', label: '17' },
        { value: '18', label: '18' },
        { value: '19', label: '19' },
        { value: '20', label: '20' },
        { value: '21', label: '21' },
        { value: '22', label: '22' },
        { value: '23', label: '23' },
        { value: '24', label: '24' },
        { value: '25', label: '25' },
        { value: '26', label: '26' },
        { value: '27', label: '27' },
        { value: '28', label: '28' },
        { value: '29', label: '29' },
        { value: '30', label: '30' },
        { value: '31', label: '31' },
      ],
      required: true,
      sm: 6,
    },
    {
      name: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'Cash', label: 'Cash' },
        { value: 'Cheque', label: 'Cheque' },
      ],
      required: true,
      sm: 6,
    },
    { name: 'totalAmount', label: 'Total Amount', type: 'number', required: true, sm: 6 },
    { name: 'totalReceived', label: 'Total Received', type: 'number', sm: 6, disabled: true },
    { name: 'totalBalance', label: 'Total Balance', type: 'number', sm: 6, disabled: true },
    {
      name: 'toAccount',
      label: 'To Account',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'Cash in hand', label: 'Cash in hand' },
      ],
      sm: 6,
    },
    { name: 'chequeNo', label: 'Cheque No.', sm: 6 },
    {
      name: 'chequeBank',
      label: 'Cheque Bank',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        // Add bank options as needed
      ],
      sm: 6,
    },
    { name: 'chequeDate', label: 'Cheque Date', type: 'date', sm: 6 },
    { name: 'amount', label: 'Amount', type: 'number', required: true, sm: 6 },
    { name: 'bankReference', label: 'Bank Reference', sm: 6 },
    { name: 'details', label: 'Details', multiline: true, rows: 2 },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Date' },
    { id: 'party', label: 'Party' },
    { id: 'processing', label: 'Processing' },
    { id: 'paymentMode', label: 'Payment Mode' },
    { id: 'toAccount', label: 'To Account' },
    { id: 'chequeNo', label: 'Cheque No.' },
    { id: 'chequeDate', label: 'Cheque Date' },
    { id: 'chequeBank', label: 'Cheque Bank' },
    { id: 'amount', label: 'Amount' },
    { id: 'bankReference', label: 'Reference' },
  ];

  const viewFields = [
    ...fields,
    { name: 'totalAmount', label: 'Total Amount' },
    { name: 'totalReceived', label: 'Total Received' },
    { name: 'totalBalance', label: 'Total Balance' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
        party: '',
        processing: '',
        paymentMode: '',
        totalAmount: 0,
        totalReceived: 0,
        totalBalance: 0,
        toAccount: '',
        chequeNo: '',
        chequeBank: '',
        chequeDate: '',
        amount: 0,
        bankReference: '',
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
        party: '',
        processing: '',
        paymentMode: '',
        totalAmount: 0,
        totalReceived: 0,
        totalBalance: 0,
        toAccount: '',
        chequeNo: '',
        chequeBank: '',
        chequeDate: '',
        amount: 0,
        bankReference: '',
        details: '',
      });
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        totalBalance: name === 'amount' || name === 'totalAmount' ? (prev.totalAmount || 0) - value : prev.totalBalance,
      }));
    }
  };

  const handleSubmit = () => {
    // Simulate adding/editing payment receiving (replace with API call if needed)
    console.log('Submitting:', formData);
    handleCloseModal();
  };

  // Handle loading state
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  // Handle error state
  if (isError) {
    return (
      <Typography color="error">
        Error fetching payment receivings: {error?.data?.message || error?.message || 'An unexpected error occurred.'}
      </Typography>
    );
  }

  // Ensure paymentReceivings is defined before rendering the table
  const paymentReceivingsData = paymentReceivings || [];

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
            data={paymentReceivingsData}
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
            totalRows={paymentReceivingsData.length}
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