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
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const ReceivingDetailsTable = ({ details, onChange, isViewMode }) => {
  const [newDetail, setNewDetail] = useState({
    product: '',
    quantity: 0,
    rate: 0,
    amount: 0,
    weight: 0,
  });

  const handleAddDetail = () => {
    onChange([...details, newDetail]);
    setNewDetail({
      product: '',
      quantity: 0,
      rate: 0,
      amount: 0,
      weight: 0,
    });
  };

  const handleDeleteDetail = (index) => {
    const updatedDetails = details.filter((_, i) => i !== index);
    onChange(updatedDetails);
  };

  const handleNewDetailChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prev) => ({
      ...prev,
      [name]: value,
      amount: (name === 'quantity' || name === 'rate')
        ? (name === 'quantity' ? value * prev.rate : prev.quantity * value)
        : prev.amount,
    }));
  };

  const getProductName = (product) => {
    if (!product) return '';
    if (typeof product === 'string') return product;
    return product.name || '';
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
          {details.map((detail, index) => (
            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa', '&:hover': { backgroundColor: '#f8fafc' }, '&:last-child td': { borderBottom: 'none' } }}>
              <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                {getProductName(detail.product)}
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                {detail.quantity}
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                {detail.rate}
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                {detail.amount}
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef', color: '#334155' }}>
                {detail.weight}
              </TableCell>
              {!isViewMode && (
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 12px', borderBottom: '1px solid #e8ecef' }}>
                  <IconButton onClick={() => handleDeleteDetail(index)} size="small" sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}>
                    <DeleteOutlined style={{ fontSize: '16px' }} />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isViewMode && (
        <Box sx={{ p: 2, borderTop: '1px solid #e8ecef' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Product"
              name="product"
              value={newDetail.product}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={newDetail.quantity}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Rate"
              name="rate"
              type="number"
              value={newDetail.rate}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={newDetail.amount}
              disabled
              size="small"
              sx={{ width: 100, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Weight"
              name="weight"
              type="number"
              value={newDetail.weight}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <IconButton onClick={handleAddDetail} size="small" sx={{ color: '#1976d2', '&:hover': { backgroundColor: '#e0f2fe' } }}>
              <PlusOutlined style={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </TableContainer>
  );
};

export default ReceivingDetailsTable;