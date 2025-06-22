import React, { useState, useEffect } from 'react';
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
import { useLocationsQuery, useUnitsQuery } from '../store/services/settings';
import { useGetProductsQuery } from '../store/services/product';
import { useGetReceivingsQuery } from '../store/services/receivings';

const ProcessingInTable = ({ details, onChange, isViewMode }) => {
  // Instead of managing separate state, work directly with props
  const safeDetails = Array.isArray(details) ? details : [];
  
  const { data: locations } = useLocationsQuery();
  const { data: units } = useUnitsQuery();
  const { data: products } = useGetProductsQuery();

  const [newDetail, setNewDetail] = useState({
    lot_number: '',
    date: '',
    location_id: '',
    product_id: '',
    unit_id: '',
    qty: 0,
    rate: 0,
    amount: 0,
    weight: 0,
    product_type: '',
    weight_less: 0,
    type: 'processingIn',
  });

  const { data: receivingsData } = useGetReceivingsQuery(undefined, { skip: !(newDetail.lot_number && newDetail.location_id) });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, index: null });

  // Handle change for any row
  const handleDetailChange = (index, field, value) => {
    const updated = safeDetails.map((row, i) =>
      i === index ? { 
        ...row, 
        [field]: value, 
        amount: field === 'qty' || field === 'rate'
          ? (field === 'qty' ? value * row.rate : row.qty * value)
          : row.amount,
        // Explicitly ensure type is preserved
        type: 'processingIn'
      } : row
    );
    onChange(updated);
  };

  // Handle autocomplete for any row
  const handleDetailAutocomplete = (index, field, option) => {
    const value = option ? option.id : '';
    handleDetailChange(index, field, value);
  };

  const handleTypeAutocomplete = (index, option) => {
    handleDetailChange(index, 'product_type', option ? option.value : '');
  };

  const handleAddDetail = () => {
    let prev = safeDetails.length > 0 ? safeDetails[safeDetails.length - 1] : {};
    const today = new Date().toISOString().slice(0, 10);
    const newRow = {
      lot_number: prev.lot_number || '',
      date: prev.date || today,
      location_id: '',
      product_id: '',
      unit_id: '',
      qty: 0,
      rate: 0,
      amount: 0,
      weight: 0,
      product_type: '',
      weight_less: 0,
      type: 'processingIn',
    };
    onChange([...safeDetails, newRow]);
  };

  const handleDeleteDetail = (index) => {
    setDeleteDialog({ open: true, index });
  };

  const confirmDelete = () => {
    const updatedDetails = safeDetails.filter((_, i) => i !== deleteDialog.index);
    onChange(updatedDetails);
    setDeleteDialog({ open: false, index: null });
  };

  // Autofill newDetail when receivingsData is received and qty is 0 (i.e. not auto-filled yet)
  useEffect(() => {
    if (receivingsData && newDetail.lot_number && newDetail.location_id && newDetail.qty === 0) {
      const matchingReceivings = receivingsData.filter(r => r.lot_number === newDetail.lot_number);
      if (matchingReceivings.length > 0) {
        const receiving = matchingReceivings[0];
        const matchingDetail = receiving.details.find(d => String(d.location_id) === String(newDetail.location_id));
        if (matchingDetail) {
          setNewDetail(prev => ({
            ...prev,
            product_id: matchingDetail.product.id,
            unit_id: matchingDetail.product.unit_id,
            qty: parseFloat(matchingDetail.quantity),
            weight: parseFloat(matchingDetail.weight),
          }));
        }
      }
    }
  }, [receivingsData, newDetail.lot_number, newDetail.location_id, newDetail.qty]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
        Processing In / Finished Products
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #e8ecef', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Lot #
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Location
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Product
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Unit
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Qty
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
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Type
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Weight Less
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
                <TableCell colSpan={isViewMode ? 11 : 12} sx={{ textAlign: 'center', color: '#64748b' }}>
                  No finished products available.
                </TableCell>
              </TableRow>
            ) : (
              safeDetails.map((detail, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa', '&:hover': { backgroundColor: '#f8fafc' }}}>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.lot_number || '-') : (
                      <TextField
                        name="lot_number"
                        value={detail.lot_number}
                        onChange={e => handleDetailChange(index, 'lot_number', e.target.value)}
                        size="small"
                        sx={{ width: 100 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.date || '-') : (
                      <TextField
                        name="date"
                        type="date"
                        value={detail.date}
                        onChange={e => handleDetailChange(index, 'date', e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 140 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (() => {
                      const loc = locations && locations.find(l => l.id === detail.location_id);
                      return loc ? loc.name : '-';
                    })() : (
                      <Autocomplete
                        value={locations?.find(loc => loc.id === detail.location_id) || null}
                        onChange={(event, newValue) => handleDetailAutocomplete(index, 'location_id', newValue)}
                        options={locations || []}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField {...params} label="Location" size="small" />
                        )}
                        sx={{ width: 120 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.product_id ? `Product ${detail.product_id}` : '-') : (
                      <Autocomplete
                        value={products?.find(p => p.id === detail.product_id) || null}
                        onChange={(event, newValue) => handleDetailAutocomplete(index, 'product_id', newValue)}
                        options={products || []}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField {...params} label="Product" size="small" />
                        )}
                        sx={{ width: 120 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (() => {
                      const unit = units && units.find(u => u.id === detail.unit_id);
                      return unit ? unit.name : '-';
                    })() : (
                      <Autocomplete
                        value={units?.find(u => u.id === detail.unit_id) || null}
                        onChange={(event, newValue) => handleDetailAutocomplete(index, 'unit_id', newValue)}
                        options={units || []}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField {...params} label="Unit" size="small" />
                        )}
                        sx={{ width: 100 }}
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
                    {isViewMode ? (detail.product_type || '-') : (
                      <Autocomplete
                        value={
                          detail.product_type
                            ? { label: detail.product_type, value: detail.product_type }
                            : null
                        }
                        onChange={(event, newValue) => handleTypeAutocomplete(index, newValue)}
                        options={[
                          { label: 'Byproduct', value: 'Byproduct' },
                          { label: 'Processed', value: 'Processed' }
                        ]}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField {...params} label="Type" size="small" />
                        )}
                        sx={{ width: 120 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {isViewMode ? (detail.weight_less || 0) : (
                      <TextField
                        name="weight_less"
                        type="number"
                        value={detail.weight_less}
                        onChange={e => handleDetailChange(index, 'weight_less', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: 80 }}
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

export default ProcessingInTable;