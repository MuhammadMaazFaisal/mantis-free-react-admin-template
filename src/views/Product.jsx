import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button, Box, Alert, Snackbar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetProductsQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../store/services/product';
import { useProductGroupsQuery, useUnitsQuery } from 'store/services/settings';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'store/slices/authSlice';

const Product = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    
    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
        }
    }, [isAuthenticated, navigate, location]);

    const { data: productsResponse, isLoading, isError, error, refetch } = useGetProductsQuery();
    const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const { data: groups } = useProductGroupsQuery();
    const { data: unitsData } = useUnitsQuery();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        itemNo: '',
        productName: '',
        product_group_id: '',
        unit_id: '',
    });
    
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: null,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const tableRef = useRef();
    const detailsRef = useRef();

    // Get products array safely from response
    const products = productsResponse || [];
    const transformedProducts = products;

    const fields = [
        { name: 'itemNo', label: 'Item No', required: true, sm: 6 },
        { name: 'productName', label: 'Product Name', required: true, sm: 6 },
        { 
            name: 'product_group_id', 
            label: 'Product Group', 
            required: true, 
            sm: 6, 
            type: 'select', 
            options: groups ? groups.map(group => ({ label: group.name, value: group.id })) : [] 
        },
        { 
            name: 'unit_id', 
            label: 'Unit', 
            required: true, 
            sm: 6, 
            type: 'select', 
            options: unitsData ? unitsData.map(unit => ({ label: unit.name, value: unit.id })) : [] 
        },
    ];

    const columns = [
        { id: 'id', label: 'ID' },
        { id: 'name', label: 'Product Name' },
        { id: 'product_group', label: 'Product Group', format: (value) => value?.name || '' },
        { id: 'unit', label: 'Unit', format: (value) => value?.name || '' },
        { id: 'created_at', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
        { id: 'updated_at', label: 'Updated At', format: (value) => new Date(value).toLocaleDateString() },
    ];

    const viewFields = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Product Name' },
        { name: 'product_group', label: 'Product Group', format: (value) => value?.name || '' },
        { name: 'unit', label: 'Unit', format: (value) => value?.name || '' },
        { name: 'created_at', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
        { name: 'updated_at', label: 'Updated At', format: (value) => new Date(value).toLocaleDateString() },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (mode, product = null) => {
        setModalMode(mode);
        setSelectedProduct(product);

        if (mode === 'add') {
            // Compute highest product id and prefill itemNo
            const highestId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
            setFormData({
                itemNo: highestId + 1,
                productName: '',
                product_group_id: '',
                unit_id: '',
            });
        } else if (product) {
            // Extract itemNo and productName from the name field
            const nameParts = product.name.split(' - ');
            const itemNo = nameParts[0] || '';
            const productName = nameParts.length > 1 ? nameParts[1] : product.name;
            
            setFormData({
                itemNo,
                productName,
                product_group_id: product.product_group_id || '',
                unit_id: product.unit_id || '',
            });
        } else {
            setFormData({
                itemNo: '',
                productName: '',
                product_group_id: '',
                unit_id: '',
            });
        }

        if (mode !== 'view') {
            setModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleFormChange = (e) => {
        if (e.reset) {
            setFormData({
                itemNo: '',
                productName: '',
                product_group_id: '',
                unit_id: '',
            });
        } else {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            // Construct payload per API requirements
            const payload = {
                item_no: formData.itemNo,
                name: formData.productName,
                product_group_id: formData.product_group_id,
                unit_id: formData.unit_id,
            };
            
            if (modalMode === 'add') {
                await addProduct(payload).unwrap();
                setSnackbar({
                    open: true,
                    message: 'Product added successfully',
                    severity: 'success',
                });
            } else if (modalMode === 'edit') {
                await updateProduct({ id: selectedProduct.id, ...payload }).unwrap();
                setSnackbar({
                    open: true,
                    message: 'Product updated successfully',
                    severity: 'success',
                });
            }
            handleCloseModal();
            refetch(); // Refresh data
        } catch (err) {
            setSnackbar({
                open: true,
                message: `Error: ${err.data?.message || 'Something went wrong'}`,
                severity: 'error',
            });
        }
    };
    
    const handleDeleteClick = (product) => {
        setDeleteDialog({
            open: true,
            id: product.id,
        });
    };
    
    const handleDeleteConfirm = async () => {
        try {
            await deleteProduct(deleteDialog.id).unwrap();
            setSnackbar({
                open: true,
                message: 'Product deleted successfully',
                severity: 'success',
            });
            setDeleteDialog({ open: false, id: null });
            refetch(); // Refresh data
        } catch (err) {
            setSnackbar({
                open: true,
                message: `Error: ${err.data?.message || 'Something went wrong'}`,
                severity: 'error',
            });
            setDeleteDialog({ open: false, id: null });
        }
    };
    
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

     if (isLoading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        );
      }
    if (isError) return <Alert severity="error">Error: {error?.data?.message || 'Failed to load products'}</Alert>;

    return (
        <Box>
            {modalMode === 'view' && selectedProduct ? (
                <>
                    <ViewDetails
                        data={selectedProduct}
                        title={`Product Details - ${selectedProduct.name}`}
                        detailsRef={detailsRef}
                        fields={viewFields}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="outlined" onClick={handleCloseModal}>
                            Back to Product List
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => handleOpenModal('edit', selectedProduct)}
                        >
                            Edit Product
                        </Button>
                        {/* <Button 
                            variant="contained" 
                            color="error"
                            startIcon={<DeleteOutlined />}
                            onClick={() => handleDeleteClick(selectedProduct)}
                        >
                            Delete
                        </Button> */}
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h4">Products</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PlusOutlined />}
                            onClick={() => handleOpenModal('add')}
                        >
                            Add New Product
                        </Button>
                    </Box>
                    <SharedTable
                        columns={columns}
                        data={transformedProducts}
                        onEdit={(product) => handleOpenModal('edit', product)}
                        onView={(product) => handleOpenModal('view', product)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        totalRows={products.length}
                        tableRef={tableRef}
                    />
                </>
            )}
            
            {/* Form Modal */}
            <SharedModal
                open={modalOpen}
                onClose={handleCloseModal}
                title={
                    modalMode === 'add'
                        ? 'Add New Product'
                        : modalMode === 'edit'
                            ? 'Edit Product Details'
                            : 'View Product Details'
                }
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                mode={modalMode}
                fields={fields}
            />
            
            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
            >
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>Cancel</Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Product;