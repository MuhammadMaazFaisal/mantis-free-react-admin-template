import React, { useState, useRef, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Button,
  TextField,
  TableSortLabel,
  Collapse,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { EditOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import TabbedSubTable, { getTabCounts } from './TabbedSubTable';

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
  subTableConfig,
  showActions = true, // new prop added
}) => {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(columns[0]?.id || '');
  const [expandedRows, setExpandedRows] = useState({});

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'Table Data',
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 4px 8px;
          font-size: 12px;
        }
        th {
          background-color: #f5f5f5;
        }
      }
    `,
  });

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleExpandRow = (rowId, tabIndex) => {
    setExpandedRows((prev) => {
      const isExpanded = prev[rowId]?.expanded;
      return {
        ...prev,
        [rowId]: {
          expanded: !isExpanded,
          selectedTab: tabIndex,
        },
      };
    });
  };

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  const filteredData = useMemo(() => {
    let result = [...safeData];
    if (search) {
      result = result.filter((row) =>
        columns.some((column) => {
          const value = column.render ? column.render(row) : row[column.id];
          return value && value.toString().toLowerCase().includes(search.toLowerCase());
        })
      );
    }
    return result;
  }, [safeData, search, columns]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    
    const columnDefinition = columns.find(col => col.id === orderBy);
    if (!columnDefinition) return filteredData;
  
    const comparator = (a, b) => {
      const aValue = columnDefinition.render ? columnDefinition.render(a) : a[orderBy];
      const bValue = columnDefinition.render ? columnDefinition.render(b) : b[orderBy];
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    };
    
    return [...filteredData].sort(comparator);
  }, [filteredData, order, orderBy, columns]);

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const hasSubTable = subTableConfig && Array.isArray(subTableConfig.tabs) && subTableConfig.tabs.length > 0;

  return (
    <Box sx={{ p: 1 }}>
      {/* Search and Download Button Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#fff',
              '&:hover fieldset': {
                borderColor: '#90caf9',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#90caf9',
              },
              '& input': {
                padding: '8px 12px',
                fontSize: '0.85rem',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#666',
              fontSize: '0.85rem',
              transform: 'translate(12px, 8px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(12px, -6px) scale(0.75)',
              },
            },
          }}
        />
        {/* <Button
          variant="outlined"
          startIcon={<DownloadOutlined />}
          onClick={handlePrint}
          size="small"
          sx={{
            borderRadius: '8px',
            borderColor: '#e0e0e0',
            color: '#666',
            textTransform: 'none',
            fontSize: '0.85rem',
            '&:hover': {
              borderColor: '#90caf9',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Download
        </Button> */}
      </Box>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        ref={tableRef}
        sx={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e8ecef',
        }}
      >
        <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
              }}
            >
              {hasSubTable && (
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: '#1e293b',
                    padding: '8px 12px',
                    borderBottom: '1px solid #e8ecef',
                    width: '150px',
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  Sub-Table Counts
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: '#1e293b',
                    padding: '8px 12px',
                    borderBottom: '1px solid #e8ecef',
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                    sx={{
                      color: '#1e293b !important',
                      '&:hover': {
                        color: '#1976d2 !important',
                      },
                      '& .MuiTableSortLabel-icon': {
                        color: '#1e293b !important',
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              {showActions && (
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: '#1e293b',
                    padding: '8px 12px',
                    borderBottom: '1px solid #e8ecef',
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => {
              const tabCounts = hasSubTable ? getTabCounts(subTableConfig.tabs, row) : [];
              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    hover
                    onClick={() => onView(row)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        transition: 'background-color 0.2s ease-in-out',
                      },
                      '&:last-child td': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    {hasSubTable && (
                      <TableCell
                        sx={{
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                          borderBottom: '1px solid #e8ecef',
                          borderRight: '1px solid #e8ecef',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {tabCounts.map((count, tabIndex) => (
                            <Chip
                              key={tabIndex}
                              label={`${subTableConfig.tabs[tabIndex].label}: ${count}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExpandRow(row.id, tabIndex);
                              }}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: '24px',
                                backgroundColor: '#e0f2fe',
                                color: '#0ea5e9',
                                '&:hover': {
                                  backgroundColor: '#bae6fd',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                          borderBottom: '1px solid #e8ecef',
                          borderRight:
                            colIndex < columns.length - 1 ? '1px solid #e8ecef' : 'none',
                          color: '#334155',
                        }}
                      >
                        {column.render
                          ? column.render(row[column.id], row)
                          : (column.format
                              ? column.format(row[column.id], row)
                              : row[column.id]
                            )}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell
                        sx={{
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                          borderBottom: '1px solid #e8ecef',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              size="small"
                              sx={{
                                color: '#1976d2',
                                '&:hover': {
                                  backgroundColor: '#e0f2fe',
                                },
                              }}
                            >
                              <EditOutlined style={{ fontSize: '16px' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(row);
                              }}
                              size="small"
                              sx={{
                                color: '#1976d2',
                                '&:hover': {
                                  backgroundColor: '#e0f2fe',
                                },
                              }}
                            >
                              <EyeOutlined style={{ fontSize: '16px' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                  {hasSubTable && (
                    <TableRow>
                      <TableCell colSpan={columns.length + (showActions ? 2 : 1)} sx={{ padding: 0, border: 'none' }}>
                        <Collapse
                          in={expandedRows[row.id]?.expanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          <TabbedSubTable
                            tabs={subTableConfig.tabs}
                            data={row}
                            isViewMode={true}
                            initialTab={expandedRows[row.id]?.selectedTab || 0}
                          />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          mt: 1,
          '& .MuiTablePagination-toolbar': {
            fontSize: '0.8rem',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.8rem',
            color: '#666',
          },
        }}
      />
    </Box>
  );
};

export default SharedTable;