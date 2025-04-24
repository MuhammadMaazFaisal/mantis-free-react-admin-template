import React, { useState } from 'react';
import { Typography, Box, TextField, Button, MenuItem, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useGetPartyLedgerQuery } from '../../store/services/reportService';
import { useChartsOfAccountsQuery } from '../../store/services/settings';
import SharedTable from '../../components/SharedTable';

const PartyLedger = () => {
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    account: '',
  });
  const [queryParams, setQueryParams] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data, error, isLoading } = useGetPartyLedgerQuery(queryParams || {}, { skip: !queryParams });
  const { data: accountsData, isLoading: isAccountsLoading, error: accountsError } = useChartsOfAccountsQuery();

  // Helper function to convert dayjs date to "YYYY-MM-DD"
  const dateToString = (date) => date ? date.format("YYYY-MM-DD") : null;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSearch = () => {
    setQueryParams({
      fromDate: dateToString(formData.fromDate),
      toDate: dateToString(formData.toDate),
      account_id: formData.account
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableData = (data?.data || []).map((row, index) => ({
    ...row,
    id: row.id ?? row.reference ?? index,
  }));

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
                <MenuItem value="">
                  Please select
                </MenuItem>
                { isAccountsLoading ? (
                  <MenuItem value=""><em>Loading...</em></MenuItem>
                ) : accountsError ? (
                  <MenuItem value=""><em>Error loading accounts</em></MenuItem>
                ) : (
                  accountsData.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.account_name}
                    </MenuItem>
                  ))
                )}
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
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading party ledger</div>}
      {data && 
        <SharedTable
          columns={[
            { id: "date", label: "DATE" },
            { id: "description", label: "DESCRIPTION" },
            { id: "reference", label: "REFERENCE" },
            { id: "debit", label: "DEBIT" },
            { id: "credit", label: "CREDIT" },
            { id: "balance", label: "BALANCE" }
          ]}
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

export default PartyLedger;