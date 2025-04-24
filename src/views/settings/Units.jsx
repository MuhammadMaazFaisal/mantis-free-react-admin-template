import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import ViewDetails from '../../components/ViewDetails';
import { useUnitsQuery, useAddUnitMutation, useUpdateUnitMutation } from '../../store/services/settings';

const Units = () => {
  const { data: unitsData = [], refetch } = useUnitsQuery();
  const [addUnit] = useAddUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();

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
  const [viewItem, setViewItem] = useState(null);

  const fields = [
    { name: 'name', label: 'Name', required: true, sm: 6 },
    { name: 'details', label: 'Details', multiline: true, rows: 2, sm: 6 },
    { name: 'active', label: 'Active', type: 'checkbox', sm: 6 },
  ];

  const viewFields = [
    { name: 'name', label: 'Name' },
    { name: 'details', label: 'Details' },
    { name: 'active', label: 'Active', render: (data) => (data ? 'Yes' : 'No') },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'user_id', label: 'User ID' },
    { id: 'name', label: 'Name' },
    { id: 'details', label: 'Details' },
    { id: 'active', label: 'Active', format: (value) => (value ? 'Yes' : 'No') },
    { id: 'added_by', label: 'Added By' },
    { id: 'added_on', label: 'Added On' },
    { id: 'created_at', label: 'Created At' },
    { id: 'modified_by', label: 'Modified By' },
    { id: 'modified_on', label: 'Modified On' },
    { id: 'updated_at', label: 'Updated At' },
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

  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        await addUnit(formData);
        toast.success('Unit created successfully');
      } else {
        await updateUnit({ id: selectedUnit.id, ...formData });
        toast.success('Unit updated successfully');
      }
      await refetch();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  return (
    <Box>
      {viewItem ? (
        <>
          <ViewDetails data={viewItem} title={`Unit Details - ID ${viewItem.id}`} fields={viewFields} />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setViewItem(null)}>
              Back to Unit List
            </Button>
          </Box>
        </>
      ) : (
        <>
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
            onView={(unit) => setViewItem(unit)}
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
            title={modalMode === 'add' ? 'Units, Add new' : 'Edit Unit'}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            mode={modalMode}
            fields={fields}
          />
        </>
      )}
    </Box>
  );
};

export default Units;