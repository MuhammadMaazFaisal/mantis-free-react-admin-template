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

const ProcessingExpensesTable = ({ details, onChange, isViewMode }) => {
  // Ensure details is an array
  const safeDetails = Array.isArray(details) ? details : [];

  const [newDetail, setNewDetail] = useState({
    chargesType: '',
    details: '',
    qty: 0,
    weight: 0,
    rate: 0,
    amount: 0,
    type: 'processingExpenses',
  });

  const handleAddDetail = () => {
    onChange([...safeDetails, newDetail]);
    setNewDetail({
      chargesType: '',
      details: '',
      qty: 0,
      weight: 0,
      rate: 0,
      amount: 0,
      type: 'processingExpenses',
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
        Processing Expenses
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
                Charges Type
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
                Details
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
                <TableCell colSpan={isViewMode ? 6 : 7} sx={{ textAlign: 'center', color: '#64748b' }}>
                  No expenses available.
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
                    {detail.chargesType || '-'}
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
                    {detail.details || '-'}
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
              label="Charges Type"
              name="chargesType"
              value={newDetail.chargesType}
              onChange={handleNewDetailChange}
              select
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            >
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="Processing Charges">Processing Charges</MenuItem>
            </TextField>
            <TextField
              label="Details"
              name="details"
              value={newDetail.details}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 200, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
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
              label="Weight"
              name="weight"
              type="number"
              value={newDetail.weight}
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

export default ProcessingExpensesTable;