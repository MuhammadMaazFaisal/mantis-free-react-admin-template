import React, { useRef } from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import { DownloadOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

const ViewDetails = ({ data, title, detailsRef, fields }) => {
  const handlePrint = useReactToPrint({
    content: () => detailsRef.current,
    documentTitle: `${title} Details`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .details-container {
          padding: 20px;
        }
        .details-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .details-label {
          font-weight: 500;
          font-size: 14px;
        }
        .details-value {
          font-size: 14px;
        }
      }
    `,
  });

  const renderValue = (key, value) => {
    const field = fields.find((f) => f.name === key);
    if (field && field.format) {
      return field.format(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value || '-';
  };

  const renderLabel = (key) => {
    const field = fields.find((f) => f.name === key);
    return field ? field.label : key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadOutlined />}
          onClick={handlePrint}
          size="small"
        >
          Download PDF
        </Button>
      </Box>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
        ref={detailsRef}
        className="details-container"
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}
          className="details-title"
        >
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {Object.entries(data).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              borderBottom: '1px solid #eee',
            }}
            className="details-row"
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: '#424242' }}
              className="details-label"
            >
              {renderLabel(key)}:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#616161' }}
              className="details-value"
            >
              {renderValue(key, value)}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ViewDetails;