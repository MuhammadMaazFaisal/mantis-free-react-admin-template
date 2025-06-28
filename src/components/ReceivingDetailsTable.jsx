import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  MenuItem,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetProductsQuery } from '../store/services/product';

const ReceivingDetailsTable = ({ details, onChange, isViewMode, locationOptions = [] }) => {
  const { data: products } = useGetProductsQuery();
  const productOptions = products ? products.map(p => ({ id: p.id, name: p.name })) : [];

  const [newDetail, setNewDetail] = useState({
    product: null,
    quantity: 0,
    rate: 0,
    amount: 0,
    weight: 0,
    location: null,
  });

  const [deleteDialog, setDeleteDialog] = useState({ open: false, index: null });

  // Track which row is a new row being added
  const [addingRow, setAddingRow] = useState(false);

  // Helper to get option by id (for both id and value)
  const getOptionById = (options, id) => {
    if (!id) return null;
    return options.find(opt => opt.id === id || opt.value === id) || null;
  };

  // Inline row change
  const handleDetailChange = (index, field, value) => {
    const updated = details.map((row, i) =>
      i === index
        ? {
            ...row,
            [field]: value,
            amount:
              field === 'quantity' || field === 'rate'
                ? field === 'quantity'
                  ? value * row.rate
                  : row.quantity * value
                : row.amount,
          }
        : row
    );
    onChange(updated);
  };

  // Inline Autocomplete change
  const handleDetailAutocomplete = (index, field, option) => {
    handleDetailChange(index, field, option ? option.id : '');
  };

  // Add new row to details
  const handleAddRow = () => {
    setAddingRow(true);
    onChange([
      ...details,
      {
        product: null,
        quantity: 0,
        rate: 0,
        amount: 0,
        weight: 0,
        location: null,
      },
    ]);
  };

  // Save new row (when user edits the last row)
  const handleSaveNewRow = (index) => {
    const row = details[index];
    if (!row.product || !row.location) return;
    // Convert Autocomplete objects to ids
    const updated = details.map((d, i) =>
      i === index
        ? {
            ...d,
            product: typeof d.product === 'object' ? d.product.id : d.product,
            location: typeof d.location === 'object' ? d.location.id : d.location,
          }
        : d
    );
    setAddingRow(false);
    onChange(updated);
  };

  // Remove last row if cancelled
  const handleCancelNewRow = (index) => {
    setAddingRow(false);
    onChange(details.filter((_, i) => i !== index));
  };

  // Delete row
  const handleDeleteDetail = (index) => {
    setDeleteDialog({ open: true, index });
  };

  const confirmDelete = () => {
    const updatedDetails = details.filter((_, i) => i !== deleteDialog.index);
    onChange(updatedDetails);
    setDeleteDialog({ open: false, index: null });
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #e8ecef', boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
              Product
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
              Location
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
              Rate
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
              Amount
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
              Weight
            </TableCell>
            {!isViewMode && (
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {details.length === 0 && (
            <TableRow>
              <TableCell colSpan={isViewMode ? 6 : 7} sx={{ textAlign: 'center', color: '#64748b' }}>
                No details available.
              </TableCell>
            </TableRow>
          )}
          {details.map((detail, index) => {
            // Remove isNewRow logic, always show delete for all rows
            // Prefer nested product/location object if present
            const productObj = detail.product && typeof detail.product === 'object'
              ? detail.product
              : detail.product_id && typeof detail.product_id === 'object'
                ? detail.product_id
                : detail.product
                  ? getOptionById(productOptions, detail.product)
                  : null;
            const locationObj = detail.location && typeof detail.location === 'object'
              ? detail.location
              : detail.location_id && typeof detail.location_id === 'object'
                ? detail.location_id
                : detail.location
                  ? getOptionById(locationOptions, detail.location)
                  : null;

            return (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                  '&:hover': { backgroundColor: '#f8fafc' },
                  '&:last-child td': { borderBottom: 'none' },
                }}
              >
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                  {isViewMode ? (
                    // Show product name from nested object if present
                    (detail.product && detail.product.name) ||
                    (detail.product_id && detail.product_id.name) ||
                    getOptionById(productOptions, detail.product)?.name ||
                    getOptionById(productOptions, detail.product_id)?.name ||
                    ''
                  ) : (
                    <Autocomplete
                      value={productObj}
                      onChange={(_, newValue) => handleDetailChange(index, 'product', newValue)}
                      options={productOptions}
                      getOptionLabel={option => option?.name || ''}
                      renderInput={params => <TextField {...params} label="Product" size="small" />}
                      sx={{ width: 120 }}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                  {isViewMode ? (
                    // Show location name from nested object if present
                    (detail.location && detail.location.name) ||
                    (detail.location_id && detail.location_id.name) ||
                    getOptionById(locationOptions, detail.location)?.label ||
                    getOptionById(locationOptions, detail.location_id)?.label ||
                    ''
                  ) : (
                    <Autocomplete
                      value={locationObj}
                      onChange={(_, newValue) => handleDetailChange(index, 'location', newValue)}
                      options={locationOptions}
                      getOptionLabel={option => option?.label || option?.name || ''}
                      renderInput={params => <TextField {...params} label="Location" size="small" />}
                      sx={{ width: 120 }}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                  {isViewMode ? (
                    detail.quantity
                  ) : (
                    <TextField
                      name="quantity"
                      type="number"
                      value={detail.quantity}
                      onChange={e => handleDetailChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                  {isViewMode ? (
                    detail.rate
                  ) : (
                    <TextField
                      name="rate"
                      type="number"
                      value={detail.rate}
                      onChange={e => handleDetailChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                  {isViewMode ? (
                    detail.amount
                  ) : (
                    <TextField
                      name="amount"
                      type="number"
                      value={detail.amount}
                      disabled
                      size="small"
                      sx={{ width: 100 }}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                  {isViewMode ? (
                    detail.weight
                  ) : (
                    <TextField
                      name="weight"
                      type="number"
                      value={detail.weight}
                      onChange={e => handleDetailChange(index, 'weight', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  )}
                </TableCell>
                {!isViewMode && (
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                    <IconButton onClick={() => handleDeleteDetail(index)} size="small" sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}>
                      <DeleteOutlined style={{ fontSize: '16px' }} />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!isViewMode && !addingRow && (
        <Box sx={{ p: 2, borderTop: '1px solid #e8ecef' }}>
          <Button variant="outlined" onClick={handleAddRow} startIcon={<PlusOutlined />}>
            Add Row
          </Button>
        </Box>
      )}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, index: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this row?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, index: null })}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ReceivingDetailsTable;