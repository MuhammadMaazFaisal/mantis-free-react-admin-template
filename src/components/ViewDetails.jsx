import React from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';

const ViewDetails = ({ data, title, detailsRef, fields, renderCustomContent }) => {
  // Helper function to convert a value to a string for display
  const formatValueForDisplay = (value, fieldName) => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} items` : 'None';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value); // Convert objects to JSON string
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  return (
    <Box ref={detailsRef}>
      <Typography variant="h4" sx={{ mb: 3 }}>{title}</Typography>
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '8px' }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {field.label}
                </Typography>
                <Typography sx={{ color: '#334155' }}>
                  {formatValueForDisplay(data[field.name], field.name)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        {/* Add spacing on top of the Paper component */}
        <Box sx={{ mt: 3 }}>

          {renderCustomContent && renderCustomContent({ data, isViewMode: true })}
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewDetails;