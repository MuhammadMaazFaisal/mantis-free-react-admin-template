import React, { useState, useRef } from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import { 
  useGetAdministrativeExpensesQuery, 
  useAddAdministrativeExpenseMutation, 
  useUpdateAdministrativeExpenseMutation 
} from '../store/services/adminExpenses';
import { useChartsOfAccountsQuery } from '../store/services/settings';

const AdministrativeExpenses = () => {
  const navigate = useNavigate();
  const { data: accounts } = useChartsOfAccountsQuery();

  const { data: administrativeExpenses, isLoading, isError, error } = useGetAdministrativeExpensesQuery();
  
  const [addExpense] = useAddAdministrativeExpenseMutation();
  const [updateExpense] = useUpdateAdministrativeExpenseMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    from_account_id: '',
    expense_account_id: '',
    total: 0,
    reference: '',
    details: '',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const accountOptions = accounts 
    ? accounts.map(acc => ({ value: acc.id.toString(), label: acc.account_name }))
    : [{ value: '', label: 'Please select' }];

  const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true, sm: 6 },
    {
      name: 'from_account_id',
      label: 'From Account',
      type: 'select',
      options: accountOptions,
      required: true,
      sm: 6,
    },
    {
      name: 'expense_account_id',
      label: 'Expense Account',
      type: 'select',
      options: accountOptions,
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
      setFormData({
        id: expense.id, // added to send id in update URL
        date: expense.date,
        from_account_id: expense.from_account ? expense.from_account.id.toString() : "",
        expense_account_id: expense.expense_account ? expense.expense_account.id.toString() : "",
        total: expense.total,
        reference: expense.reference,
        details: expense.details,
      });
    } else {
      setFormData({
        date: '',
        from_account_id: '',
        expense_account_id: '',
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
        from_account_id: '',
        expense_account_id: '',
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
    if(modalMode === 'add'){
      addExpense(formData).then(() => handleCloseModal());
    } else if(modalMode === 'edit'){
      updateExpense(formData).then(() => handleCloseModal());
    } else {
      handleCloseModal();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error">
        Error fetching administrative expenses: {error?.data?.message || error?.message || 'An unexpected error occurred.'}
      </Typography>
    );
  }

  const formattedExpenses = administrativeExpenses?.map(exp => ({
    ...exp,
    fromAccount: exp.from_account ? exp.from_account.account_name : '-',
    expenseAccount: exp.expense_account ? exp.expense_account.account_name : '-'
  })) || [];

  return (
    <Box>
      {modalMode === 'view' && selectedExpense ? (
        <>
          <ViewDetails
            data={selectedExpense}
            title={`Administrative Expense [${selectedExpense.id}]`}
            detailsRef={detailsRef}
            fields={fields}
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
            data={formattedExpenses}
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
            totalRows={formattedExpenses.length}
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