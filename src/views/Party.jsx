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
  const [addParty, { isLoading: isAdding, error: addError }] = useAddPartyMutation();
  const [updateParty, { isLoading: isUpdating, error: updateError }] = useUpdatePartyMutation();
  const [deleteParty, { isLoading: isDeleting, error: deleteError }] = useDeletePartyMutation();
  console.log('Parties:', parties);
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  const fields = [
    { id: 'name', label: 'Party Name', required: true },
    { id: 'address', label: 'Address', multiline: true, rows: 2 },
    { id: 'contact_number', label: 'Contact Number', sm: 6 },
    { id: 'discount', label: 'Discount (%)', type: 'number', required: true, sm: 6 },
    { id: 'opening_balance_date', label: 'Opening Balance Date', type: 'date', required: true, sm: 6 },
    { id: 'opening_balance', label: 'Opening Balance (₹)', type: 'number', required: true, sm: 6 },
    { id: 'remarks', label: 'Remarks', multiline: true, rows: 2 },
    { id: 'active', label: 'Is Active', type: 'checkbox', format: (value) => value === 1 },
  ];

  // Transform API data to match table expectations
  const transformedParties = parties?.map(party => ({
    ...party,
    active: party.active === 1 // Convert to boolean for checkbox
  })) || [];

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
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedParty(null);
    if (modalMode === 'view') {
      navigate('/party');
    }
  };

  const handleFormChange = (e) => {
    if (e.reset) {
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
      // Prepare data for API
      const apiData = {
        ...data,
        active: data.active ? 1 : 0 // Convert boolean back to 1/0 for API
      };

      if (modalMode === 'add') {
        await addParty(apiData).unwrap();
        console.log('Party added successfully');
      } else if (modalMode === 'edit') {
        await updateParty({ ...apiData, id: selectedParty.id }).unwrap();
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
            data={transformedParties}
            isLoading={isLoading}
            onEdit={(party) => handleOpenModal('edit', party)}
            onView={(party) => handleOpenModal('view', party)}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={transformedParties?.length || 0}
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