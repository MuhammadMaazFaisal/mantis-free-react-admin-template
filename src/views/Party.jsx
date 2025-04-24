import React, { useState, useRef } from 'react';
import { Typography, Button, Box, Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetPartiesQuery, useAddPartyMutation, useUpdatePartyMutation, useDeletePartyMutation } from '../store/services/party';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'store/slices/authSlice';

const Party = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  const { data: parties, isLoading, isError, error, refetch } = useGetPartiesQuery();
  const [addParty, { isLoading: isAdding }] = useAddPartyMutation();
  const [updateParty, { isLoading: isUpdating }] = useUpdatePartyMutation();
  const [deleteParty, { isLoading: isDeleting }] = useDeletePartyMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedParty, setSelectedParty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_number: '',
    discount: 0.0,
    opening_balance_date: '',
    opening_balance: 0.0,
    remarks: '',
    active: true,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const fields = [
    { name: 'name', label: 'Party Name', required: true, sm: 6 },
    { name: 'address', label: 'Address', multiline: true, rows: 2, sm: 12 },
    { name: 'contact_number', label: 'Contact Number', sm: 6 },
    { name: 'discount', label: 'Discount (%)', type: 'number', required: true, sm: 6 },
    { name: 'opening_balance_date', label: 'Opening Balance Date', type: 'date', required: true, sm: 6 },
    { name: 'opening_balance', label: 'Opening Balance (₹)', type: 'number', required: true, sm: 6 },
    { name: 'remarks', label: 'Remarks', multiline: true, rows: 2, sm: 12 },
    { name: 'active', label: 'Is Active', type: 'checkbox', sm: 12 },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'user_id', label: 'User ID' },
    { id: 'name', label: 'Party Name' },
    { id: 'address', label: 'Address' },
    { id: 'contact_number', label: 'Contact Number' },
    { id: 'discount', label: 'Discount (%)' },
    { id: 'opening_balance_date', label: 'Opening Balance Date' },
    { id: 'opening_balance', label: 'Opening Balance' },
    { id: 'remarks', label: 'Remarks' },
    { id: 'active', label: 'Status', format: (value) => value ? 'Active' : 'Inactive' },
    { id: 'created_at', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
    { id: 'updated_at', label: 'Updated At', format: (value) => new Date(value).toLocaleDateString() },
  ];

  const viewFields = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Party Name' },
    { name: 'address', label: 'Address' },
    { name: 'contact_number', label: 'Contact Number' },
    { name: 'discount', label: 'Discount (%)' },
    { name: 'opening_balance', label: 'Opening Balance' },
    { name: 'active', label: 'Status', format: (value) => value ? 'Active' : 'Inactive' },
    { name: 'created_at', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
    { name: 'updated_at', label: 'Updated At', format: (value) => new Date(value).toLocaleDateString() },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, party = null) => {
    setModalMode(mode);
    setSelectedParty(party);
    if (party) {
      setFormData({
        ...party,
        opening_balance_date: party.opening_balance_date ? party.opening_balance_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        contact_number: '',
        discount: 0.0,
        opening_balance_date: '',
        opening_balance: 0.0,
        remarks: '',
        active: true,
      });
    }
    // Only open the modal for add or edit modes like in Product.jsx
    if (mode !== 'view') {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedParty(null);
    if (modalMode === 'view') {
      navigate('/party');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        opening_balance: parseFloat(formData.opening_balance),
        discount: parseFloat(formData.discount),
      };

      if (modalMode === 'add') {
        await addParty(payload).unwrap();
        setSnackbar({
          open: true,
          message: 'Party added successfully',
          severity: 'success',
        });
      } else if (modalMode === 'edit') {
        await updateParty({ ...payload, id: selectedParty.id }).unwrap();
        setSnackbar({
          open: true,
          message: 'Party updated successfully',
          severity: 'success',
        });
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.data?.message || 'Failed to save party'}`,
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (party) => {
    setDeleteDialog({
      open: true,
      id: party.id,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteParty(deleteDialog.id).unwrap();
      setSnackbar({
        open: true,
        message: 'Party deleted successfully',
        severity: 'success',
      });
      setDeleteDialog({ open: false, id: null });
      refetch();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.data?.message || 'Failed to delete party'}`,
        severity: 'error',
      });
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) return <Alert severity="error">Error: {error?.data?.message || 'Failed to load parties'}</Alert>;

  return (
    <Box>
      {modalMode === 'view' && selectedParty ? (
        <>
          <ViewDetails
            data={selectedParty}
            title={`Party Details - ${selectedParty.name}`}
            detailsRef={detailsRef}
            fields={viewFields}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/party')}>
              Back to Party List
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => handleOpenModal('edit', selectedParty)}
            >
              Edit Party
            </Button>
            {/* <Button 
              variant="contained" 
              color="error"
              startIcon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(selectedParty)}
            >
              Delete
            </Button> */}
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Parties</Typography>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => handleOpenModal('add')}
            >
              Add New Party
            </Button>
          </Box>
          <SharedTable
            columns={columns}
            data={parties || []}
            onEdit={(party) => handleOpenModal('edit', party)}
            onView={(party) => handleOpenModal('view', party)}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={parties?.length || 0}
            tableRef={tableRef}
          />
        </>
      )}

      {/* Render the form modal only for add and edit modes */}
      {modalMode !== 'view' && (
        <SharedModal
          open={modalOpen}
          onClose={handleCloseModal}
          title={
            modalMode === 'add'
              ? 'Add New Party'
              : 'Edit Party Details'
          }
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          mode={modalMode}
          fields={fields}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>Delete Party</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this party? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Party;