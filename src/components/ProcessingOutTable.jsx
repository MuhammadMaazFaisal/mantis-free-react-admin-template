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
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocationsQuery, useUnitsQuery } from '../store/services/settings';
import { useGetProductsQuery } from '../store/services/product';
import { useGetReceivingsQuery } from '../store/services/receivings';

const ProcessingOutTable = ({ details, onChange, isViewMode }) => {
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
    available_qty: 0,
    qty: 0,
    qty_less: 0,
    available_weight: 0,
    weight: 0,
    weight_less: 0,
    type: 'processingOut',
  });
  const { data: receivingsData } = useGetReceivingsQuery(undefined, { skip: !(newDetail.lot_number && newDetail.location_id) });

  const handleAddDetail = () => {
    onChange([...safeDetails, newDetail]);
    setNewDetail({
      lot_number: '',
      date: '',
      location_id: '',
      product_id: '',
      unit_id: '',
      available_qty: 0,
      qty: 0,
      qty_less: 0,
      available_weight: 0,
      weight: 0,
      weight_less: 0,
      type: 'processingOut',
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
      [name]: name === "date" || name.endsWith('_id') || name === 'lot_number'
        ? value
        : parseFloat(value) || 0,
    }));
  };

  // Autofill newDetail when receivingsData is received and no available_qty has been set yet
  useEffect(() => {
    if (receivingsData && newDetail.lot_number && newDetail.location_id && newDetail.available_qty === 0) {
      const matchingReceivings = receivingsData.filter(r => r.lot_number === newDetail.lot_number);
      if (matchingReceivings.length > 0) {
        const receiving = matchingReceivings[0];
        const matchingDetail = receiving.details.find(d => String(d.location_id) === String(newDetail.location_id));
        if (matchingDetail) {
          setNewDetail(prev => ({
            ...prev,
            product_id: matchingDetail.product.id,
            unit_id: matchingDetail.product.unit_id,
            available_qty: parseFloat(matchingDetail.quantity),
            available_weight: parseFloat(matchingDetail.weight),
          }));
        }
      }
    }
  }, [receivingsData, newDetail.lot_number, newDetail.location_id, newDetail.available_qty]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>
        Processing Out / Raw Material
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
                Available Qty
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Qty
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Qty Less
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Available Weight
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                Weight
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
                  No raw materials available.
                </TableCell>
              </TableRow>
            ) : (
              safeDetails.map((detail, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa', '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.lot_number || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.date || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {(() => {
                      const loc = locations && locations.find(l => l.id === detail.location_id);
                      return loc ? loc.name : '-';
                    })()}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.product_id ? `Product ${detail.product_id}` : '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {(() => {
                      const unit = units && units.find(u => u.id === detail.unit_id);
                      return unit ? unit.name : '-';
                    })()}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.available_qty || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.qty || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.qty_less || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.available_weight || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.weight || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', borderRight: '1px solid #e8ecef' }}>
                    {detail.weight_less || 0}
                  </TableCell>
                  {!isViewMode && (
                    <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                      <IconButton onClick={() => handleDeleteDetail(index)} size="small" sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}>
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
              {locations && locations.map(loc => (
                <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
              ))}
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
              {products && products.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
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
              <MenuItem value="">Select</MenuItem>
              {units && units.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </TextField>
            <TextField label="Available Qty" name="available_qty" type="number" value={newDetail.available_qty} onChange={handleNewDetailChange} size="small" sx={{ width: 100 }} />
            <TextField label="Qty" name="qty" type="number" value={newDetail.qty} onChange={handleNewDetailChange} size="small" sx={{ width: 80 }} />
            <TextField label="Qty Less" name="qty_less" type="number" value={newDetail.qty_less} onChange={handleNewDetailChange} size="small" sx={{ width: 80 }} />
            <TextField label="Available Weight" name="available_weight" type="number" value={newDetail.available_weight} onChange={handleNewDetailChange} size="small" sx={{ width: 100 }} />
            <TextField label="Weight" name="weight" type="number" value={newDetail.weight} onChange={handleNewDetailChange} size="small" sx={{ width: 80 }} />
            <TextField label="Weight Less" name="weight_less" type="number" value={newDetail.weight_less} onChange={handleNewDetailChange} size="small" sx={{ width: 80 }} />
            <IconButton onClick={handleAddDetail} size="small" sx={{ color: '#1976d2', '&:hover': { backgroundColor: '#e0f2fe' } }}>
              <PlusOutlined style={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProcessingOutTable;