import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useGetPartiesQuery, useAddPartyMutation, useUpdatePartyMutation } from '../store/services/party';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import { useNavigate } from 'react-router-dom';

const Party = () => {
  const navigate = useNavigate();
  const { data: parties, isLoading } = useGetPartiesQuery();
  const [addParty] = useAddPartyMutation();
  const [updateParty] = useUpdatePartyMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'view'
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

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Party Name' },
    { id: 'address', label: 'Address' },
    { id: 'contactNumber', label: 'Contact Number' },
    { id: 'discount', label: 'Discount (%)' },
    { id: 'openingBalanceDate', label: 'Opening Balance Date' },
    { id: 'openingBalance', label: 'Opening Balance (₹)' },
    { id: 'remarks', label: 'Remarks' },
    {
      id: 'active',
      label: 'Is Active',
      format: (value) => (value ? 'Yes' : 'No'),
    },
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
      setFormData(party);
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
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      addParty(formData);
    } else if (modalMode === 'edit') {
      updateParty({ ...formData, id: selectedParty.id });
    }
    handleCloseModal();
  };

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
            <Button variant="outlined" onClick={() => navigate('/party')}>
              Back to Party List
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Party List</Typography>
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
            data={parties}
            onEdit={(party) => handleOpenModal('edit', party)}
            onView={(party) => handleOpenModal('view', party)}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={parties.length}
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
      />
    </Box>
  );
};

export default Party;