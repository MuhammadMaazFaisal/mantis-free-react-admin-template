import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import { 
  useChargesTypesQuery, 
  useAddChargeTypeMutation, 
  useUpdateChargeTypeMutation,
  useDeleteChargeTypeMutation 
} from '../../store/services/settings';

const ChargesTypes = () => {
  const { data: chargesData = [], isLoading, isError, error, refetch } = useChargesTypesQuery();
  const [addChargeType] = useAddChargeTypeMutation();
  const [updateChargeType] = useUpdateChargeTypeMutation();
  const [deleteChargeType] = useDeleteChargeTypeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedChargeType, setSelectedChargeType] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, chargeType = null) => {
    setModalMode(mode);
    setSelectedChargeType(chargeType);
    if (chargeType) {
      setFormData(chargeType);
    } else {
      setFormData({ name: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedChargeType(null);
  };

  const handleView = (chargeType) => {
    tableRef.current = null;
    setModalMode('view');
    setSelectedChargeType(chargeType);
    setFormData(chargeType);
    setModalOpen(true);
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
        await addChargeType(formData).unwrap();
        toast.success('Charge Type created successfully');
      } else {
        await updateChargeType({ id: selectedChargeType.id, ...formData }).unwrap();
        toast.success('Charge Type updated successfully');
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
      await deleteChargeType(itemToDelete.id).unwrap();
      toast.success('Charge Type deleted successfully');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Charges Types</Typography>
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
        data={chargesData}
        onView={(chargeType) => handleView(chargeType)}
        onEdit={(chargeType) => {
          tableRef.current = null;
          handleOpenModal('edit', chargeType);
        }}
        onDelete={handleDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={chargesData.length}
        tableRef={tableRef}
      />
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Charges Types, Add new'
            : 'Edit Charge Type'
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
    </Box>
  );
};

export default ChargesTypes;