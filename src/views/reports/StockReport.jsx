import React, { useState } from 'react';
import { Typography, Box, TextField, Button, MenuItem } from '@mui/material';

const StockReport = () => {
  const [warehouse, setWarehouse] = useState('');

  const handleWarehouseChange = (e) => {
    setWarehouse(e.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for stock in warehouse:', warehouse);
    // Add logic to fetch and display stock data
  };

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
          <MenuItem value="SA GODOWN">SA GODOWN</MenuItem>
          {/* Add more warehouses if available */}
        </TextField>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default StockReport;