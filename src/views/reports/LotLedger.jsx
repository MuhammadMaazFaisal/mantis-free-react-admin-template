import React, { useState } from 'react';
import { Typography, Box, TextField, Button, MenuItem } from '@mui/material';

const LotLedger = () => {
  const [lotNumber, setLotNumber] = useState('');

  const handleLotChange = (e) => {
    setLotNumber(e.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for lot:', lotNumber);
    // Add logic to fetch and display data
  };

  const handleBillPrint = () => {
    console.log('Printing bill for lot:', lotNumber);
    // Add logic to print bill
  };

  const handleStockSummary = () => {
    console.log('Viewing stock summary for lot:', lotNumber);
    // Add logic to view stock summary
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>Lot Ledger</Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Lot #"
          value={lotNumber}
          onChange={handleLotChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Please select</MenuItem>
          {/* Add lot numbers if available */}
        </TextField>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleBillPrint}>
          Bill Print
        </Button>
        <Button variant="outlined" onClick={handleStockSummary}>
          Stock Summary
        </Button>
      </Box>
    </Box>
  );
};

export default LotLedger;