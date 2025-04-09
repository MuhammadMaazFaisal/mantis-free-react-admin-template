import React, { useRef } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { DownloadOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

const ViewDetails = ({ data, title, detailsRef }) => {
  const handlePrint = useReactToPrint({
    content: () => detailsRef.current,
    documentTitle: `${title} Details`,
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
      <Paper sx={{ p: 3 }} ref={detailsRef}>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} sx={{ mb: 1 }}>
            <Typography variant="subtitle2" component="span">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
            </Typography>{' '}
            <Typography component="span">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ViewDetails;