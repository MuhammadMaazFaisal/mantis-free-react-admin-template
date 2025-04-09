import React, { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  Button,
} from '@mui/material';
import { EditOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

const SharedTable = ({
  columns,
  data,
  onEdit,
  onView,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  totalRows,
  tableRef,
}) => {
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'Table Data',
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadOutlined />}
          onClick={handlePrint}
        >
          Download PDF
        </Button>
      </Box>
      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.format ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => onEdit(row)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton onClick={() => onView(row)}>
                    <EyeOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default SharedTable;