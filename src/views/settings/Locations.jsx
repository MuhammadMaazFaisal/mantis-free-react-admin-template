import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';

// Mock data for Locations
const mockLocations = [
  {
    id: 1,
    warehouse: 'Warehouse',
    name: 'SA GODOWN',
    details: '',
    addedBy: 'Admin',
    addedOn: '24/10/2022 22:43:44',
    modifiedBy: 'Admin',
    modifiedOn: '07/08/2023 13:56:15',
    active: true,
  },
  {
    id: 3,
    warehouse: 'Warehouse',
    name: 'PARTY GODOWN',
    details: '',
    addedBy: 'Admin',
    addedOn: '19/10/2023 16:42:08',
    modifiedBy: '',
    modifiedOn: '',
    active: true,
  },
];

const Locations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    warehouse: '',
    name: '',
    details: '',
    active: true,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();

  const fields = [
    {
      name: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'Warehouse', label: 'Warehouse' },
      ],
      required: true,
      sm: 6,
    },
    { name: 'name', label: 'Name', required: true, sm: 6 },
    { name: 'details', label: 'Details', multiline: true, rows: 2, sm: 6 },
    { name: 'active', label: 'Active', type: 'checkbox', sm: 6 },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'name', label: 'Name' },
    { id: 'details', label: 'Details' },
    { id: 'addedBy', label: 'Added By' },
    { id: 'addedOn', label: 'Added On' },
    { id: 'modifiedBy', label: 'Modified By' },
    { id: 'modifiedOn', label: 'Modified On' },
    {
      id: 'active',
      label: 'Active',
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

  const handleOpenModal = (mode, location = null) => {
    setModalMode(mode);
    setSelectedLocation(location);
    if (location) {
      setFormData(location);
    } else {
      setFormData({
        warehouse: '',
        name: '',
        details: '',
        active: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLocation(null);
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        warehouse: '',
        name: '',
        details: '',
        active: true,
      });
    } else {
      const { name, value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'active' ? checked : value,
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting:', formData);
    handleCloseModal();
  };

  const locationsData = mockLocations || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Locations</Typography>
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
        data={locationsData}
        onEdit={(location) => {
          tableRef.current = null;
          handleOpenModal('edit', location);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={locationsData.length}
        tableRef={tableRef}
      />
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Locations, Add new'
            : 'Edit Location'
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

export default Locations;