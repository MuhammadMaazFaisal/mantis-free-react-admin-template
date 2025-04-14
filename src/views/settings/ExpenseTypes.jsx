import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';

// Mock data for Expense Types
const mockExpenseTypes = [
  { id: 1, name: 'HODI Unloading' },
];

const ExpenseTypes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedExpenseType, setSelectedExpenseType] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();

  const fields = [
    { name: 'name', label: 'Name', required: true },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, expenseType = null) => {
    setModalMode(mode);
    setSelectedExpenseType(expenseType);
    if (expenseType) {
      setFormData(expenseType);
    } else {
      setFormData({ name: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExpenseType(null);
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({ name: '' });
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting:', formData);
    handleCloseModal();
  };

  const expenseTypesData = mockExpenseTypes || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Expense Types</Typography>
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
        data={expenseTypesData}
        onEdit={(expenseType) => {
          tableRef.current = null;
          handleOpenModal('edit', expenseType);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={expenseTypesData.length}
        tableRef={tableRef}
      />
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Expense Types, Add new'
            : 'Edit Expense Type'
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

export default ExpenseTypes;