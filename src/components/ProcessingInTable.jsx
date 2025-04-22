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
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const ProcessingInTable = ({ details, onChange, isViewMode }) => {
  const safeDetails = Array.isArray(details) ? details : [];

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

  const handleAddDetail = () => {
    onChange([...safeDetails, newDetail]);
    setNewDetail({
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
  };

  const handleDeleteDetail = (index) => {
    const updatedDetails = safeDetails.filter((_, i) => i !== index);
    onChange(updatedDetails);
  };

  const handleNewDetailChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prev) => ({
      ...prev,
      [name]: name.endsWith('_id') || name === 'lot_number' || name === 'product_type' ? value : parseFloat(value) || 0,
      amount: name === 'qty' || name === 'rate' ? 
        (name === 'qty' ? value * prev.rate : prev.qty * value) : 
        prev.amount,
    }));
  };

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
                    {detail.lot_number || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.date || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.location_id || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.product_id || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.unit_id || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.qty || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.rate || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.amount || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.weight || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.product_type || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.weight_less || 0}
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
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Lot #"
              name="lot_number"
              value={newDetail.lot_number}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 100 }}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newDetail.date}
              onChange={handleNewDetailChange}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
            <TextField
              label="Location"
              name="location_id"
              value={newDetail.location_id}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="1">SA GODOWN</MenuItem>
            </TextField>
            <TextField
              label="Product"
              name="product_id"
              value={newDetail.product_id}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="1">1121 Sella B1 Mix</MenuItem>
              <MenuItem value="2">1121 Sella Car 2</MenuItem>
            </TextField>
            <TextField
              label="Unit"
              name="unit_id"
              value={newDetail.unit_id}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 100 }}
            >
              <MenuItem value="1">Kg</MenuItem>
              <MenuItem value="2">Ton</MenuItem>
            </TextField>
            <TextField
              label="Qty"
              name="qty"
              type="number"
              value={newDetail.qty}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80 }}
            />
            <TextField
              label="Rate"
              name="rate"
              type="number"
              value={newDetail.rate}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80 }}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={newDetail.amount}
              disabled
              size="small"
              sx={{ width: 100 }}
            />
            <TextField
              label="Weight"
              name="weight"
              type="number"
              value={newDetail.weight}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80 }}
            />
            <TextField
              label="Type"
              name="product_type"
              value={newDetail.product_type}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Byproduct">Byproduct</MenuItem>
              <MenuItem value="Finished Product">Finished Product</MenuItem>
            </TextField>
            <TextField
              label="Weight Less"
              name="weight_less"
              type="number"
              value={newDetail.weight_less}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80 }}
            />
            <IconButton onClick={handleAddDetail} size="small" sx={{ color: '#1976d2', '&:hover': { backgroundColor: '#e0f2fe' }}}>
              <PlusOutlined style={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProcessingInTable;