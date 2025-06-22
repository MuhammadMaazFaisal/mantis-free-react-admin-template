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
  MenuItem,
  Box,
  Typography,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useChargesTypesQuery } from '../store/services/settings';

const ProcessingExpensesTable = ({ details, onChange, isViewMode }) => {
  const safeDetails = Array.isArray(details) ? details : [];
  console.log('ProcessingExpensesTable - received details:', safeDetails);
  
  const { data: chargesTypes } = useChargesTypesQuery();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, index: null });

  // Handle change for any row
  const handleDetailChange = (index, field, value) => {
    const updated = safeDetails.map((row, i) =>
      i === index
        ? {
            ...row,
            [field]: value,
            amount:
              field === 'rate' || field === 'weight'
                ? (field === 'rate'
                    ? value * row.weight
                    : row.rate * value)
                : row.rate * row.weight,
            // Explicitly ensure type is preserved
            type: 'processingExpenses'
          }
        : row
    );
    console.log('ProcessingExpensesTable - sending updated data:', updated);
    onChange(updated);
  };

  // Handle autocomplete for any row
  const handleDetailAutocomplete = (index, field, option) => {
    const value = option ? option.id : '';
    handleDetailChange(index, field, value);
  };

  const handleAddDetail = () => {
    onChange([...safeDetails, {
      charges_type_id: '',
      details: '',
      qty: 0,
      weight: 0,
      rate: 0,
      amount: 0,
      type: 'processingExpenses',
    }]);
  };

  const handleDeleteDetail = (index) => {
    setDeleteDialog({ open: true, index });
  };

  const confirmDelete = () => {
    const updatedDetails = safeDetails.filter((_, i) => i !== deleteDialog.index);
    onChange(updatedDetails);
    setDeleteDialog({ open: false, index: null });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
        Processing Expenses
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #e8ecef', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Charges Type
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Details
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Qty
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Weight
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Rate
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Amount
              </TableCell>
              {!isViewMode && (
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {safeDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isViewMode ? 6 : 7} sx={{ textAlign: 'center', color: '#64748b' }}>
                  No expenses available.
                </TableCell>
              </TableRow>
            ) : (
              safeDetails.map((detail, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa', '&:hover': { backgroundColor: '#f8fafc' }}}>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (chargesTypes?.find(ct => String(ct.id) === String(detail.charges_type_id))?.name || '-') : (
                      <Autocomplete
                        value={chargesTypes?.find(ct => String(ct.id) === String(detail.charges_type_id)) || null}
                        onChange={(event, newValue) => handleDetailAutocomplete(index, 'charges_type_id', newValue)}
                        options={chargesTypes || []}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField {...params} label="Charges Type" size="small" />
                        )}
                        sx={{ width: 120 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.details || '-') : (
                      <TextField
                        name="details"
                        value={detail.details}
                        onChange={e => handleDetailChange(index, 'details', e.target.value)}
                        size="small"
                        sx={{ width: 200 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.qty || 0) : (
                      <TextField
                        name="qty"
                        type="number"
                        value={detail.qty}
                        onChange={e => handleDetailChange(index, 'qty', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: 80 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.weight || 0) : (
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
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.rate || 0) : (
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
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.amount || 0) : (
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
                  {!isViewMode && (
                    <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                      <IconButton onClick={() => handleDeleteDetail(index)} size="small" sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' }}}>
                        <DeleteOutlined style={{ fontSize: '16px' }} />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!isViewMode && (
        <Box sx={{ p: 2, borderTop: '1px solid #e8ecef' }}>
          <Button variant="outlined" onClick={handleAddDetail} startIcon={<PlusOutlined />}>
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
    </Box>
  );
};

export default ProcessingExpensesTable;