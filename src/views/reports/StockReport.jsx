import React, { useState } from 'react';
import { Typography, Box, TextField, MenuItem } from '@mui/material';
import { useGetStockReportQuery } from '../../store/services/reportService';
import { useWarehousesQuery } from '../../store/services/settings';
import SharedTable from '../../components/SharedTable';

const StockReport = () => {
  const [warehouse, setWarehouse] = useState('');
  // New state for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  const { data, isLoading, error } = useGetStockReportQuery(warehouse, { skip: !warehouse });
  const { data: warehousesResponse } = useWarehousesQuery();

  const handleWarehouseChange = (e) => {
    setWarehouse(e.target.value);
    setPage(0); // reset pagination when changing warehouse
  };

  // Pagination handlers similar to TrialBalanceReport
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Use data directly if it's an array; fallback to data.data if not
  const tableData = (Array.isArray(data) ? data : data || []).map((row, index) => ({
    ...row,
    id: row.id ?? index, // assign a unique id if missing
  }));
  
  // Static header for Stock Report
  const columns = [
    { id: "product", label: "PRODUCT" },
    { id: "warehouse", label: "WAREHOUSE" },
    { id: "lot_number", label: "LOT NUMBER" },
    { id: "quantity", label: "QUANTITY" },
    { id: "expiry_date", label: "EXPIRY DATE" }
  ];

  return (
    <Box>
      <Typography variant="h4" mb={3}>Stock Report</Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Warehouse"
          value={warehouse}
          onChange={handleWarehouseChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Please select</MenuItem>
          {warehousesResponse?.map((wh) => (
            <MenuItem key={wh.id} value={wh.id}>
              {wh.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading stock report</div>}
      {tableData.length > 0 && 
        <SharedTable
          columns={columns}
          data={tableData}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          totalRows={tableData.length}
          showActions={false}
        />
      }
    </Box>
  );
};

export default StockReport;