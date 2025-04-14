import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';

// Mock data for Units
const mockUnits = [
  {
    id: 1,
    name: 'Kg',
    details: '',
    addedBy: 'Admin',
    addedOn: '16/07/2022 21:04:41',
    modifiedBy: 'Admin',
    modifiedOn: '04/04/2023 11:02:05',
    active: true,
  },
];

const Units = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    active: true,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();

  const fields = [
    { name: 'name', label: 'Name', required: true, sm: 6 },
    { name: 'details', label: 'Details', multiline: true, rows: 2, sm: 6 },
    { name: 'active', label: 'Active', type: 'checkbox', sm: 6 },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
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

  const handleOpenModal = (mode, unit = null) => {
    setModalMode(mode);
    setSelectedUnit(unit);
    if (unit) {
      setFormData(unit);
    } else {
      setFormData({
        name: '',
        details: '',
        active: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUnit(null);
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
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

  const unitsData = mockUnits || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Units</Typography>
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
        data={unitsData}
        onEdit={(unit) => {
          tableRef.current = null;
          handleOpenModal('edit', unit);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={unitsData.length}
        tableRef={tableRef}
      />
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Units, Add new'
            : 'Edit Unit'
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

export default Units;