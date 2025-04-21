import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import { useProductGroupsQuery, useAddProductGroupMutation, useUpdateProductGroupMutation } from '../../store/services/settings';

const ProductGroups = () => {
  const { data: productGroupsData = [], refetch } = useProductGroupsQuery();
  const [addProductGroup] = useAddProductGroupMutation();
  const [updateProductGroup] = useUpdateProductGroupMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedProductGroup, setSelectedProductGroup] = useState(null);
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

  const handleOpenModal = (mode, productGroup = null) => {
    setModalMode(mode);
    setSelectedProductGroup(productGroup);
    if (productGroup) {
      setFormData(productGroup);
    } else {
      setFormData({ name: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductGroup(null);
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
        await addProductGroup(formData);
        toast.success('Product Group created successfully');
      } else {
        await updateProductGroup(formData);
        toast.success('Product Group updated successfully');
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
        <Typography variant="h4">Product Groups</Typography>
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
        data={productGroupsData}
        onEdit={(productGroup) => {
          tableRef.current = null;
          handleOpenModal('edit', productGroup);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={productGroupsData.length}
        tableRef={tableRef}
      />
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Product Groups, Add new'
            : 'Edit Product Group'
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

export default ProductGroups;