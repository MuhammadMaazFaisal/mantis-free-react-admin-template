import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useGetProductsQuery, useAddProductMutation, useUpdateProductMutation } from '../store/services/product';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const navigate = useNavigate();
    const { data: products, isLoading } = useGetProductsQuery();
    const [addProduct] = useAddProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        productGroup: '',
        name: '',
        unit: '',
        productQuality: '',
        ratePerQty: 0.0,
        dueDays: 120,
        amountAfterDueDays: 0.0,
        details: '',
        active: true,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const tableRef = useRef();
    const detailsRef = useRef();

    const fields = [
        {
            name: 'productGroup',
            label: 'Product Group',
            type: 'select',
            options: [
                { value: '', label: 'Please select' },
                { value: 'Rice Raw', label: 'Rice Raw' },
                { value: 'Rice Finish', label: 'Rice Finish' },
            ],
            required: true,
            sm: 6,
        },
        { name: 'name', label: 'Product Name', required: true, sm: 6 },
        {
            name: 'unit',
            label: 'Unit',
            type: 'select',
            options: [
                { value: '', label: 'Please select' },
                { value: 'Kg', label: 'Kg' },
            ],
            required: true,
            sm: 6,
        },
        { name: 'productQuality', label: 'Product Quality', sm: 6 },
        { name: 'ratePerQty', label: 'Rate Per Quantity (₹)', type: 'number', required: true, sm: 6 },
        { name: 'dueDays', label: 'Due Days', type: 'number', required: true, sm: 6 },
        { name: 'amountAfterDueDays', label: 'Amount After Due Days (₹)', type: 'number', required: true, sm: 6 },
        { name: 'details', label: 'Details', multiline: true, rows: 2 },
        { name: 'active', label: 'Is Active', type: 'checkbox' },
    ];

    const columns = [
        { id: 'id', label: 'ID' },
        { id: 'productGroup', label: 'Product Group' },
        { id: 'name', label: 'Product Name' },
        { id: 'unit', label: 'Unit' },
        { id: 'productQuality', label: 'Product Quality' },
        { id: 'ratePerQty', label: 'Rate Per Quantity (₹)' },
        { id: 'dueDays', label: 'Due Days' },
        { id: 'amountAfterDueDays', label: 'Amount After Due Days (₹)' },
        { id: 'details', label: 'Details' },
        {
            id: 'active',
            label: 'Is Active',
            format: (value) => (value ? 'Yes' : 'No'),
        },
    ];

    const viewFields = [
        ...fields,
        { name: 'addedBy', label: 'Added By' },
        { name: 'addedOn', label: 'Added On' },
        { name: 'modifiedBy', label: 'Modified By' },
        { name: 'modifiedOn', label: 'Modified On' },
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
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                productGroup: '',
                name: '',
                unit: '',
                productQuality: '',
                ratePerQty: 0.0,
                dueDays: 120,
                amountAfterDueDays: 0.0,
                details: '',
                active: true,
            });
        }

        if (mode !== 'view') {
            setModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
        if (modalMode === 'view') {
            navigate('/product');
        }
    };

    const handleFormChange = (e) => {
        if (e.reset) {
            setFormData({
                productGroup: '',
                name: '',
                unit: '',
                productQuality: '',
                ratePerQty: 0.0,
                dueDays: 120,
                amountAfterDueDays: 0.0,
                details: '',
                active: true,
            });
        } else {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        if (modalMode === 'add') {
            addProduct(formData);
        } else if (modalMode === 'edit') {
            updateProduct({ ...formData, id: selectedProduct.id });
        }
        handleCloseModal();
    };

    if (isLoading) return <Typography>Loading...</Typography>;

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
                    <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/product')}>
                            Back to Product List
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h4">Product List</Typography>
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
                        data={products}
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
        </Box>
    );
};

export default Product;