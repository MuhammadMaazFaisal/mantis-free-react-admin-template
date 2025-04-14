import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import SharedTable from '../../components/SharedTable';

// Mock data for Receivable Report
const mockReceivableData = [
  { id: 1, party: 'S A Rice', lotNumber: '', fileNumber: '', receivable: '80,111,010.00' },
  { id: 2, party: 'Kafaaf Enterprises', lotNumber: '', fileNumber: '', receivable: '67,060.00' },
  { id: 3, party: 'MANNAL Foods', lotNumber: '', fileNumber: '', receivable: '3,146,196.20' },
  { id: 4, party: 'Asian Grain', lotNumber: '', fileNumber: '', receivable: '644,581.50' },
  { id: 5, party: 'Zafar Bhai Broker', lotNumber: '', fileNumber: '', receivable: '140,160.00' },
  { id: 6, party: 'Abdul Rauf Abdul Aziz', lotNumber: '', fileNumber: '', receivable: '4,625,573.50' },
  { id: 7, party: 'Kafi Commodities', lotNumber: '', fileNumber: '', receivable: '64,885.00' },
  { id: 8, party: 'Ali Commodities', lotNumber: '', fileNumber: '', receivable: '1,886,452.50' },
  { id: 9, party: 'S M Ismail', lotNumber: '', fileNumber: '', receivable: '496,309.00' },
  { id: 10, party: 'AFN Rice', lotNumber: '', fileNumber: '', receivable: '189,670.00' },
  { id: 11, party: 'Munawar shah Rice', lotNumber: '', fileNumber: '', receivable: '536,296.00' },
  { id: 12, party: 'Dhanwani AK International', lotNumber: '', fileNumber: '', receivable: '953,447.50' },
  { id: 13, party: 'Saad International (Siraj Sagar)', lotNumber: '', fileNumber: '', receivable: '488,510.00' },
  { id: 14, party: 'Zohra Rice', lotNumber: '', fileNumber: '', receivable: '74,675.00' },
];

const ReceivableReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const columns = [
    { id: 'party', label: 'PARTY' },
    { id: 'lotNumber', label: 'Lot #' },
    { id: 'fileNumber', label: 'File Number' },
    { id: 'receivable', label: 'RECEIVABLE', align: 'right' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>Receivable Report</Typography>
      <SharedTable
        columns={columns}
        data={mockReceivableData}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={mockReceivableData.length}
        showActions={false}
      />
    </Box>
  );
};

export default ReceivableReport;