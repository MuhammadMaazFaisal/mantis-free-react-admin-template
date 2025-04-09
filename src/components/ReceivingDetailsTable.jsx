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
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const ReceivingDetailsTable = ({ details, onChange, isViewMode }) => {
  const [newDetail, setNewDetail] = useState({
    location: '',
    product: '',
    unit: '',
    qty: 0,
    rate: 0,
    amount: 0,
    weight: 0,
    invRate: 0,
    fortyKgRate: 0,
    vehicleNo: '',
  });

  const handleAddDetail = () => {
    onChange([...details, newDetail]);
    setNewDetail({
      location: '',
      product: '',
      unit: '',
      qty: 0,
      rate: 0,
      amount: 0,
      weight: 0,
      invRate: 0,
      fortyKgRate: 0,
      vehicleNo: '',
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
      amount: name === 'qty' || name === 'rate' ? (name === 'qty' ? value * prev.rate : prev.qty * value) : prev.amount,
    }));
  };

  return (
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
          <TableRow
            sx={{
              backgroundColor: '#f1f5f9', // Match SharedTable header color
              color: '#1e293b',
            }}
          >
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
              Inv Rate
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
              40kg Rate
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
              Vehicle No
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
          {details.map((detail, index) => (
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
                {detail.location}
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
                {detail.product}
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
                {detail.unit}
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
                {detail.qty}
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
                {detail.rate}
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
                {detail.amount}
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
                {detail.weight}
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
                {detail.invRate}
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
                {detail.fortyKgRate}
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
                {detail.vehicleNo}
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
          ))}
        </TableBody>
      </Table>
      {!isViewMode && (
        <Box sx={{ p: 2, borderTop: '1px solid #e8ecef' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Location"
              name="location"
              value={newDetail.location}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Product"
              name="product"
              value={newDetail.product}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
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
              label="Inv Rate"
              name="invRate"
              type="number"
              value={newDetail.invRate}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="40kg Rate"
              name="fortyKgRate"
              type="number"
              value={newDetail.fortyKgRate}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 80, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
            />
            <TextField
              label="Vehicle No"
              name="vehicleNo"
              value={newDetail.vehicleNo}
              onChange={handleNewDetailChange}
              size="small"
              sx={{ width: 120, '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
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
    </TableContainer>
  );
};

export default ReceivingDetailsTable;