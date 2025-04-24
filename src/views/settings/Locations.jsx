import React, { useState, useRef } from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import ViewDetails from '../../components/ViewDetails';
import { 
  useLocationsQuery, 
  useAddLocationMutation, 
  useUpdateLocationMutation,
  useDeleteLocationMutation 
} from '../../store/services/settings';
import { useWarehousesQuery } from '../../store/services/settings';

const Locations = () => {
  const { data: locationsData = [], isLoading, isError, error, refetch } = useLocationsQuery();
  const { data: warehousesData = [] } = useWarehousesQuery();
  const [addLocation] = useAddLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    warehouse_id: '',
    name: '',
    details: '',
    active: true,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();

  const fields = [
    {
      name: 'warehouse_id',
      label: 'Warehouse',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        ...warehousesData.map(warehouse => ({
          value: warehouse.id,
          label: warehouse.name
        }))
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
    { 
      id: 'warehouse_id', 
      label: 'Warehouse',
      format: (value) => {
        const warehouse = warehousesData.find(w => w.id === value);
        return warehouse ? warehouse.name : '-';
      }
    },
    { id: 'name', label: 'Name' },
    { id: 'details', label: 'Details' },
    {
      id: 'active',
      label: 'Active',
      format: (value) => (value ? 'Yes' : 'No'),
    },
  ];

  const viewFields = [
    { 
      name: 'warehouse_id', 
      label: 'Warehouse', 
      render: (value) => {
         const warehouse = warehousesData.find(w => w.id === value);
         return warehouse ? warehouse.name : '-';
      } 
    },
    { name: 'name', label: 'Name' },
    { name: 'details', label: 'Details' },
    { name: 'active', label: 'Active', render: (data) => data ? 'Yes' : 'No' },
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
        warehouse_id: '',
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
        warehouse_id: '',
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
        await addLocation(formData).unwrap();
        toast.success('Location created successfully');
      } else {
        await updateLocation({ id: selectedLocation.id, ...formData }).unwrap();
        toast.success('Location updated successfully');
      }
      await refetch();
      handleCloseModal();
    } catch (error) {
      toast.error(error.data?.message || 'Operation failed');
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLocation(itemToDelete.id).unwrap();
      toast.success('Location deleted successfully');
      await refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Delete failed');
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );
  if (isError) return <Typography color="error">Error: {error.data?.message || 'Failed to load data'}</Typography>;

  return (
    <Box>
      {viewItem ? (
        <>
          <ViewDetails data={viewItem} title={`Location Details - ID ${viewItem.id}`} fields={viewFields} />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setViewItem(null)}>
              Back to Location List
            </Button>
          </Box>
        </>
      ) : (
        <>
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
            onView={(location) => setViewItem(location)}
            onEdit={(location) => {
              tableRef.current = null;
              handleOpenModal('edit', location);
            }}
            onDelete={handleDelete}
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
          {/* Delete confirmation dialog */}
          {deleteConfirmOpen && (
            <Box sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1300,
            }}>
              <Box sx={{
                backgroundColor: 'background.paper',
                p: 4,
                borderRadius: 1,
                maxWidth: 400,
                width: '100%',
              }}>
                <Typography variant="h6" gutterBottom>
                  Confirm Delete
                </Typography>
                <Typography sx={{ mb: 3 }}>
                  Are you sure you want to delete "{itemToDelete?.name}"?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="error" onClick={confirmDelete}>
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Locations;