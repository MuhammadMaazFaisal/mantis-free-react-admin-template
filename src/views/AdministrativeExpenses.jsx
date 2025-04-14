import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';

// Mock data for administrative expenses
const mockAdministrativeExpenses = [
  {
    id: 1,
    date: '12/04/2025',
    fromAccount: 'Cash in hand',
    expenseAccount: 'Office Expenses',
    total: 5000,
    reference: 'Office supplies',
    details: 'Purchased stationery for office use',
  },
  {
    id: 2,
    date: '11/04/2025',
    fromAccount: 'Bank Account',
    expenseAccount: 'Utilities',
    total: 3000,
    reference: 'Electricity bill',
    details: 'Paid electricity bill for March 2025',
  },
  {
    id: 3,
    date: '10/04/2025',
    fromAccount: 'Cash in hand',
    expenseAccount: 'Travel Expenses',
    total: 2000,
    reference: 'Travel reimbursement',
    details: 'Reimbursement for employee travel',
  },
];

const AdministrativeExpenses = () => {
  const navigate = useNavigate();

  // Use mock data instead of API for now
  const administrativeExpenses = mockAdministrativeExpenses;
  const isLoading = false;
  const isError = false;
  const error = null;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'view'
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    fromAccount: '',
    expenseAccount: '',
    total: 0,
    reference: '',
    details: '',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true, sm: 6 },
    {
      name: 'fromAccount',
      label: 'From Account',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'Cash in hand', label: 'Cash in hand' },
        { value: 'Bank Account', label: 'Bank Account' },
      ],
      required: true,
      sm: 6,
    },
    {
      name: 'expenseAccount',
      label: 'Expense Account',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'Office Expenses', label: 'Office Expenses' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Travel Expenses', label: 'Travel Expenses' },
      ],
      required: true,
      sm: 6,
    },
    { name: 'total', label: 'Total', type: 'number', required: true, sm: 6 },
    { name: 'reference', label: 'Reference', sm: 6 },
    { name: 'details', label: 'Details', multiline: true, rows: 2 },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Date' },
    { id: 'fromAccount', label: 'From Account' },
    { id: 'expenseAccount', label: 'Expense Account' },
    { id: 'total', label: 'Total' },
    { id: 'reference', label: 'Reference' },
  ];

  const viewFields = [...fields];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, expense = null) => {
    setModalMode(mode);
    setSelectedExpense(expense);
    if (expense) {
      setFormData(expense);
    } else {
      setFormData({
        date: '',
        fromAccount: '',
        expenseAccount: '',
        total: 0,
        reference: '',
        details: '',
      });
    }
    if (mode !== 'view') {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExpense(null);
    if (modalMode === 'view') {
      navigate('/administrative-expenses');
    }
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        date: '',
        fromAccount: '',
        expenseAccount: '',
        total: 0,
        reference: '',
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
    // Simulate adding/editing expense (replace with API call if needed)
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
        Error fetching administrative expenses: {error?.data?.message || error?.message || 'An unexpected error occurred.'}
      </Typography>
    );
  }

  // Ensure administrativeExpenses is defined before rendering the table
  const administrativeExpensesData = administrativeExpenses || [];

  return (
    <Box>
      {modalMode === 'view' && selectedExpense ? (
        <>
          <ViewDetails
            data={selectedExpense}
            title={`Administrative Expense [${selectedExpense.id}]`}
            detailsRef={detailsRef}
            fields={viewFields}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/administrative-expenses')}>
              Back to list
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Administrative Expenses</Typography>
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
            data={administrativeExpensesData}
            onEdit={(expense) => {
              tableRef.current = null;
              handleOpenModal('edit', expense);
            }}
            onView={(expense) => {
              tableRef.current = null;
              handleOpenModal('view', expense);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={administrativeExpensesData.length}
            tableRef={tableRef}
          />
        </>
      )}
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Administrative Expenses, Add new'
            : modalMode === 'edit'
            ? 'Edit Administrative Expense'
            : 'View Administrative Expense'
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

export default AdministrativeExpenses;