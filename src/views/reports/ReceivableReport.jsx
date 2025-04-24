import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import SharedTable from '../../components/SharedTable';
import { useGetReceivableReportQuery } from '../../store/services/reportService';

const ReceivableReport = () => {
  const { data, error, isLoading } = useGetReceivableReportQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading receivable report</div>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>Receivable Report</Typography>
      <SharedTable
        columns={[
          { id: "party", label: "PARTY" },
          { id: "lot_number", label: "LOT NUMBER" },
          { id: "file_number", label: "FILE NUMBER" },
          { id: "total", label: "TOTAL" },
          { id: "paid", label: "PAID" },
          { id: "receivable", label: "RECEIVABLE" }
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

export default ReceivableReport;