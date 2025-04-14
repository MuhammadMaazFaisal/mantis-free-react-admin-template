import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';

// Mock data for Charges Types
const mockChargesTypes = [
  { id: 1, name: 'Processing Charges' },
  { id: 2, name: 'Packing Charges' },
  { id: 3, name: 'Bardana Charges' },
  { id: 4, name: 'HODI Loading' },
  { id: 5, name: 'Loading/Unloading' },
  { id: 6, name: 'Container Loading' },
  { id: 7, name: 'Other Expense' },
  { id: 8, name: 'Labour Overtime' },
];

const ChargesTypes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedChargeType, setSelectedChargeType] = useState(null);
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

  const chargesTypesData = mockChargesTypes || [];

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
        data={chargesTypesData}
        onEdit={(chargeType) => {
          tableRef.current = null;
          handleOpenModal('edit', chargeType);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={chargesTypesData.length}
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
    </Box>
  );
};

export default ChargesTypes;