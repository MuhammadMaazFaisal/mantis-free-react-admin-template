import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import SharedTable from '../../components/SharedTable';
import { useGetTrialBalanceReportQuery } from '../../store/services/reportService';

const TrialBalanceReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data, error, isLoading } = useGetTrialBalanceReportQuery();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading report</div>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>Trial Balance Report</Typography>
      <SharedTable
        columns={[
          { id: "parentCode", label: "PARENT CODE" },
          { id: "account", label: "ACCOUNT" },
          { id: "debit", label: "DEBIT" },
          { id: "credit", label: "CREDIT" }
        ]}
        data={data || []}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        totalRows={data ? data.length : 0}
        showActions={false}
      />
    </Box>
  );
};

export default TrialBalanceReport;