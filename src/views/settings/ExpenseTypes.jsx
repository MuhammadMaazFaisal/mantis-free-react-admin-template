import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import ViewDetails from '../../components/ViewDetails';
import { 
  useExpenseTypesQuery, 
  useAddExpenseTypeMutation, 
  useUpdateExpenseTypeMutation,
  useDeleteExpenseTypeMutation 
} from '../../store/services/settings';

const ExpenseTypes = () => {
  const { data: expenseTypesData = [], isLoading, isError, error, refetch } = useExpenseTypesQuery();
  const [addExpenseType] = useAddExpenseTypeMutation();
  const [updateExpenseType] = useUpdateExpenseTypeMutation();
  const [deleteExpenseType] = useDeleteExpenseTypeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedExpenseType, setSelectedExpenseType] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();

  const fields = [
    { name: 'name', label: 'Name', required: true },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'created_at', label: 'Created At', format: (value) => new Date(value).toLocaleString() },
    { id: 'updated_at', label: 'Updated At', format: (value) => new Date(value).toLocaleString() },
  ];

  // Add viewFields for view mode
  const viewFields = [
    { name: 'name', label: 'Name' },
    { name: 'created_at', label: 'Created At', format: (value) => new Date(value).toLocaleString() },
    { name: 'updated_at', label: 'Updated At', format: (value) => new Date(value).toLocaleString() },
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

  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        await addExpenseType(formData).unwrap();
        toast.success('Expense Type created successfully');
      } else {
        await updateExpenseType({ id: selectedExpenseType.id, ...formData }).unwrap();
        toast.success('Expense Type updated successfully');
      }
      await refetch();
      handleCloseModal();
    } catch (error) {
      toast.error(error.data?.message || 'Operation failed');
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExpenseType(itemToDelete.id).unwrap();
      toast.success('Expense Type deleted successfully');
      await refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Delete failed');
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography color="error">Error: {error.data?.message || 'Failed to load data'}</Typography>;

  return (
    <Box>
      {viewItem ? (
        <>
          <ViewDetails data={viewItem} title={`Expense Type Details - ID ${viewItem.id}`} fields={viewFields} />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setViewItem(null)}>
              Back to Expense Types
            </Button>
          </Box>
        </>
      ) : (
        <>
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
            onView={(expenseType) => setViewItem(expenseType)}
            onEdit={(expenseType) => {
              tableRef.current = null;
              handleOpenModal('edit', expenseType);
            }}
            onDelete={handleDelete}
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
          {/* Delete confirmation dialog */}
          {deleteConfirmOpen && (
            <Box sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1300,
            }}>
              <Box sx={{
                backgroundColor: 'background.paper',
                p: 4,
                borderRadius: 1,
                maxWidth: 400,
                width: '100%',
              }}>
                <Typography variant="h6" gutterBottom>
                  Confirm Delete
                </Typography>
                <Typography sx={{ mb: 3 }}>
                  Are you sure you want to delete "{itemToDelete?.name}"?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="error" onClick={confirmDelete}>
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ExpenseTypes;