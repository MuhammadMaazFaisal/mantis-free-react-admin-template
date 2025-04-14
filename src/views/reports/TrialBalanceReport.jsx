import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import SharedTable from '../../components/SharedTable';

// Mock data for Trial Balance Report
const mockTrialBalanceData = [
  { id: 1, parentCode: 'Cash Accounts', account: 'Cash in hand', debit: '19,662,248.48', credit: '' },
  { id: 2, parentCode: 'Processing', account: 'Processing Income', debit: '', credit: '110,150,594.68' },
  { id: 3, parentCode: 'Customers', account: 'S A Rice', debit: '80,111,010.00', credit: '' },
  { id: 4, parentCode: 'Customers', account: 'Kafaaf Enterprises', debit: '67,060.00', credit: '' },
  { id: 5, parentCode: 'Customers', account: 'MANNAL Foods', debit: '3,146,196.20', credit: '' },
  { id: 6, parentCode: 'Customers', account: 'Asian Grain', debit: '644,581.50', credit: '' },
  { id: 7, parentCode: 'Customers', account: 'Zafar Bhai Broker', debit: '140,160.00', credit: '' },
  { id: 8, parentCode: 'Customers', account: 'Abdul Rauf Abdul Aziz', debit: '4,625,573.50', credit: '' },
  { id: 9, parentCode: 'Customers', account: 'Kafi Commodities', debit: '64,885.00', credit: '' },
  { id: 10, parentCode: 'Customers', account: 'Ali Commodities', debit: '1,886,452.50', credit: '' },
  { id: 11, parentCode: 'Customers', account: 'S M Ismail', debit: '496,309.00', credit: '' },
  { id: 12, parentCode: 'Customers', account: 'AFN Rice', debit: '189,670.00', credit: '' },
  { id: 13, parentCode: 'Customers', account: 'Munawar shah Rice', debit: '536,296.00', credit: '' },
  { id: 14, parentCode: 'Customers', account: 'Dhanwani AK International', debit: '953,447.50', credit: '' },
  { id: 15, parentCode: 'Customers', account: 'Saad International (Siraj Sagar)', debit: '488,510.00', credit: '' },
  { id: 16, parentCode: 'Customers', account: 'Zohra Rice', debit: '74,675.00', credit: '' },
];

const TrialBalanceReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const columns = [
    { id: 'parentCode', label: 'PARENT CODE' },
    { id: 'account', label: 'ACCOUNT' },
    { id: 'debit', label: 'DEBIT', align: 'right' },
    { id: 'credit', label: 'CREDIT', align: 'right' },
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
      <Typography variant="h4" mb={3}>Trial Balance Report</Typography>
      <SharedTable
        columns={columns}
        data={mockTrialBalanceData}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={mockTrialBalanceData.length}
        showActions={false}
      />
    </Box>
  );
};

export default TrialBalanceReport;