import React, { useState } from 'react';
import { Typography, Box, TextField, Button, MenuItem, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Mock data for dropdowns
const accounts = [
  'S A Rice',
  'Kafaaf Enterprises',
  'MANNAL Foods',
  'Asian Grain',
  'Zafar Bhai Broker',
  'Abdul Rauf Abdul Aziz',
  'Kafi Commodities',
  'Ali Commodities',
  'S M Ismail',
  'AFN Rice',
  'Munawar shah Rice',
  'Dhanwani AK International',
  'Saad International (Siraj Sagar)',
  'Zohra Rice',
];

const PartyLedger = () => {
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    account: '',
    lotNumber: '',
    fileNumber: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSearch = () => {
    console.log('Searching with:', formData);
    // Add logic to fetch and display data based on filters
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>Party Ledger</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="From Date *"
                value={formData.fromDate}
                onChange={handleDateChange('fromDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="To Date *"
                value={formData.toDate}
                onChange={handleDateChange('toDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Account *"
                name="account"
                value={formData.account}
                onChange={handleFormChange}
                fullWidth
              >
                <MenuItem value="">Please select</MenuItem>
                {accounts.map((account) => (
                  <MenuItem key={account} value={account}>
                    {account}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Lot #"
                name="lotNumber"
                value={formData.lotNumber}
                onChange={handleFormChange}
                fullWidth
              >
                <MenuItem value="">Please select</MenuItem>
                {/* Add lot numbers if available */}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="File #"
                name="fileNumber"
                value={formData.fileNumber}
                onChange={handleFormChange}
                fullWidth
              >
                <MenuItem value="">Please select</MenuItem>
                {/* Add file numbers if available */}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default PartyLedger;