import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useGetPartiesQuery, useAddPartyMutation, useUpdatePartyMutation, useDeletePartyMutation } from '../store/services/party';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import { useNavigate } from 'react-router-dom';

const Party = () => {
  const navigate = useNavigate();
  const { data: parties, isLoading, error, isError } = useGetPartiesQuery();
  console.log('Parties:', parties);
  const [addParty, { isLoading: isAdding, error: addError }] = useAddPartyMutation();
  const [updateParty, { isLoading: isUpdating, error: updateError }] = useUpdatePartyMutation();
  const [deleteParty, { isLoading: isDeleting, error: deleteError }] = useDeletePartyMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedParty, setSelectedParty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    discount: 0.0,
    openingBalanceDate: '',
    openingBalance: 0.0,
    remarks: '',
    active: true,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const fields = [
    { name: 'name', label: 'Party Name', required: true },
    { name: 'address', label: 'Address', multiline: true, rows: 2 },
    { name: 'contactNumber', label: 'Contact Number', sm: 6 },
    { name: 'discount', label: 'Discount (%)', type: 'number', required: true, sm: 6 },
    { name: 'openingBalanceDate', label: 'Opening Balance Date', type: 'date', required: true, sm: 6 },
    { name: 'openingBalance', label: 'Opening Balance (₹)', type: 'number', required: true, sm: 6 },
    { name: 'remarks', label: 'Remarks', multiline: true, rows: 2 },
    { name: 'active', label: 'Is Active', type: 'checkbox' },
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
        openingBalanceDate: party.openingBalanceDate ? party.openingBalanceDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
        discount: 0.0,
        openingBalanceDate: '',
        openingBalance: 0.0,
        remarks: '',
        active: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedParty(null);
    if (modalMode === 'view') {
      navigate('/parties');
    }
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
        discount: 0.0,
        openingBalanceDate: '',
        openingBalance: 0.0,
        remarks: '',
        active: true,
      });
    } else {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (modalMode === 'add') {
        await addParty(data).unwrap();
        console.log('Party added successfully');
      } else if (modalMode === 'edit') {
        await updateParty({ ...data, id: selectedParty.id }).unwrap();
        console.log('Party updated successfully');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Submit error:', err);
      alert(`Error: ${err.data?.message || 'Failed to save party'}`);
    }
  };

  const handleDelete = async (party) => {
    if (window.confirm(`Are you sure you want to delete "${party.name}"?`)) {
      try {
        await deleteParty(party.id).unwrap();
        console.log('Party deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        alert(`Error: ${err.data?.message || 'Failed to delete party'}`);
      }
    }
  };

  if (isError) {
    console.error('API error:', error);
    return <Typography color="error">Error loading parties: {error.data?.message || error.message || 'Unknown error'}</Typography>;
  }

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {modalMode === 'view' && selectedParty ? (
        <>
          <ViewDetails
            data={selectedParty}
            title={`Party Details - ${selectedParty.name}`}
            detailsRef={detailsRef}
            fields={fields}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/parties')}>
              Back to Party List
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Party Management</Typography>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => handleOpenModal('add')}
            >
              Add New Party
            </Button>
          </Box>
          <SharedTable
            columns={fields}
            data={parties || []}
            isLoading={isLoading}
            onEdit={(party) => handleOpenModal('edit', party)}
            onView={(party) => handleOpenModal('view', party)}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={parties?.length || 0}
            tableRef={tableRef}
          />
        </>
      )}
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Add New Party'
            : modalMode === 'edit'
            ? 'Edit Party Details'
            : 'View Party Details'
        }
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        mode={modalMode}
        fields={fields}
        isLoading={isAdding || isUpdating}
        error={addError || updateError}
      />
    </Box>
  );
};

export default Party;