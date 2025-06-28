import React from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';

// Helper function to format object values for display
const formatObjectValue = (value) => {
  if (!value || typeof value !== 'object') return '-';
  // Try to display 'name' if present, else fallback to id, else JSON
  if ('name' in value) return value.name;
  if ('label' in value) return value.label;
  if ('account_name' in value) return value.account_name;
  if ('id' in value) return `ID: ${value.id}`;
  return JSON.stringify(value);
};

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
      return formatObjectValue(value);
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
                  {field.render 
                    ? field.render(data) 
                    : formatValueForDisplay(data[field.name], field.name)}
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