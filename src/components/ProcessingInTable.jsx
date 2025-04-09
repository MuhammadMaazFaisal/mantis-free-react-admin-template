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
  // Ensure details is an array
  const safeDetails = Array.isArray(details) ? details : [];

  const [newDetail, setNewDetail] = useState({
    lotNumber: '',
    date: '',
    location: '',
    product: '',
    unit: '',
    qty: 0,
    rate: 0,
    amount: 0,
    weight: 0,
    type: 'processingIn',
    productType: '',
  });

  const handleAddDetail = () => {
    onChange([...safeDetails, newDetail]);
    setNewDetail({
      lotNumber: '',
      date: '',
      location: '',
      product: '',
      unit: '',
      qty: 0,
      rate: 0,
      amount: 0,
      weight: 0,
      type: 'processingIn',
      productType: '',
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
      [name]: value,
      amount: name === 'qty' || name === 'rate' ? (name === 'qty' ? value * prev.rate : prev.qty * value) : prev.amount,
    }));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 1, fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}
      >
        Processing In / Finished Products
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '8px',
          border: '1px solid #e8ecef',
          boxShadow: 'none',
        }}
      >
        <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Lot # (new)
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Location
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Product
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Unit
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Qty
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Rate
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Weight
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  padding: '6px 12px',
                  borderBottom: '1px solid #e8ecef',
                }}
              >
                Weight Less
              </TableCell>
              {!isViewMode && (
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: '#1e293b',
                    padding: '6px 12px',
                    borderBottom: '1px solid #e8ecef',
                  }}
                >
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
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transition: 'background-color 0.2s ease-in-out',
                    },
                    '&:last-child td': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.lotNumber || '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.date || '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.location || '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.product || '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.unit || '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.qty || 0}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.rate || 0}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.amount || 0}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.weight || 0}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.productType || '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderBottom: '1px solid #e8ecef',
                      borderRight: '1px solid #e8ecef',
                      color: '#334155',
                    }}
                  >
                    {detail.weightLess || 0}
                  </TableCell>
                  {!isViewMode && (
                    <TableCell
                      sx={{
                        fontSize: '0.75rem',
                        padding: '6px 12px',
                        borderBottom: '1px solid #e8ecef',
                      }}
                    >
                      <IconButton
                        onClick={() => handleDeleteDetail(index)}
                        size="small"
                        sx={{
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: '#fee2e2',
                          },
                        }}
                      >
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
              label="Lot # (new)"
              name="lotNumber"
              value={newDetail.lotNumber}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 100, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newDetail.date}
              onChange={handleNewDetailChange}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Location"
              name="location"
              value={newDetail.location}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            >
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="SA GODOWN">SA GODOWN</MenuItem>
            </TextField>
            <TextField
              label="Product"
              name="product"
              value={newDetail.product}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            >
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="1121 Sella B1 Mix">1121 Sella B1 Mix</MenuItem>
              <MenuItem value="1121 Sella Car 2">1121 Sella Car 2</MenuItem>
              <MenuItem value="1121 Sella p.c">1121 Sella p.c</MenuItem>
              <MenuItem value="1121 Sella Sweeping">1121 Sella Sweeping</MenuItem>
              <MenuItem value="1121 Sella Powder">1121 Sella Powder</MenuItem>
              <MenuItem value="1121 Sella G-50 kg">1121 Sella G-50 kg</MenuItem>
              <MenuItem value="1121 Sella R1 50kg">1121 Sella R1 50kg</MenuItem>
              <MenuItem value="1121 Sella Hr 50kg">1121 Sella Hr 50kg</MenuItem>
              <MenuItem value="1121 Sella Car 50kg">1121 Sella Car 50kg</MenuItem>
              <MenuItem value="1121 Sella B1 50kg">1121 Sella B1 50kg</MenuItem>
            </TextField>
            <TextField
              label="Unit"
              name="unit"
              value={newDetail.unit}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 100, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            >
              <MenuItem value="Kg">Kg</MenuItem>
              <MenuItem value="Ton">Ton</MenuItem>
            </TextField>
            <TextField
              label="Qty"
              name="qty"
              type="number"
              value={newDetail.qty}
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
            <TextField
              label="Type"
              name="productType"
              value={newDetail.productType}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            >
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="Byproduct">Byproduct</MenuItem>
              <MenuItem value="Finished Product">Finished Product</MenuItem>
            </TextField>
            <TextField
              label="Weight Less"
              name="weightLess"
              type="number"
              value={newDetail.weightLess}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <IconButton
              onClick={handleAddDetail}
              size="small"
              sx={{
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#e0f2fe',
                },
              }}
            >
              <PlusOutlined style={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProcessingInTable;