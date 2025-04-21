import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import { useChargesTypesQuery, useAddChargeTypeMutation, useUpdateChargeTypeMutation } from '../../store/services/settings';

const ChargesTypes = () => {
  const { data: chargesData = [], refetch } = useChargesTypesQuery();
  const [addChargeType] = useAddChargeTypeMutation();
  const [updateChargeType] = useUpdateChargeTypeMutation();

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

  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        await addChargeType(formData);
        toast.success('Charge Type created successfully');
      } else {
        await updateChargeType(formData);
        toast.success('Charge Type updated successfully');
      }
      await refetch();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

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
        onEdit={(chargeType) => {
          tableRef.current = null;
          handleOpenModal('edit', chargeType);
        }}
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
    </Box>
  );
};

export default ChargesTypes;