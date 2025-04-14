import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';

// Mock data for Warehouses
const mockWarehouses = [
  {
    id: 1,
    name: 'SA GODOWN',
    details: '',
    addedBy: 'Admin',
    addedOn: '22/06/2022 00:00:00',
    modifiedBy: '',
    modifiedOn: '',
    active: true,
  },
];

const Warehouses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
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

  const handleOpenModal = (mode, warehouse = null) => {
    setModalMode(mode);
    setSelectedWarehouse(warehouse);
    if (warehouse) {
      setFormData(warehouse);
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
    setSelectedWarehouse(null);
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

  const warehousesData = mockWarehouses || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Warehouses</Typography>
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
        data={warehousesData}
        onEdit={(warehouse) => {
          tableRef.current = null;
          handleOpenModal('edit', warehouse);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={warehousesData.length}
        tableRef={tableRef}
      />
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Warehouses, Add new'
            : 'Edit Warehouse'
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

export default Warehouses;