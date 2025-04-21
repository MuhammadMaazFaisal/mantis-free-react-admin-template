import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, TextField, Input, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useConfigQuery, useUpdateConfigMutation } from '../../store/services/settings';

const Config = () => {
  const navigate = useNavigate();
  const { data: configData, isLoading, isError, error } = useConfigQuery();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateConfigMutation();
  
  const [formData, setFormData] = useState({
    lotNumberSerial: '',
    invoiceCycleInDays: '',
    invoiceCycleDueDays: '',
    companyFullName: '',
    companyShort: '',
    contactNumber: '',
    emails: '',
    address: '',
  });

  useEffect(() => {
    if (configData && configData.length > 0) {
      setFormData(configData[0]);
    }
  }, [configData]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateConfig(formData).unwrap();
      navigate('/settings/config');
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error: {error.data?.message || 'Failed to load config'}</Alert>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>Config</Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Lot Number Serial"
          name="lotNumberSerial"
          value={formData.lotNumberSerial || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Invoice Cycle In Days"
          name="invoiceCycleInDays"
          value={formData.invoiceCycleInDays || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
          type="number"
        />
        <TextField
          label="Invoice Cycle Due Days"
          name="invoiceCycleDueDays"
          value={formData.invoiceCycleDueDays || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
          type="number"
        />
        <TextField
          label="Company Full Name"
          name="companyFullName"
          value={formData.companyFullName || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Company Short"
          name="companyShort"
          value={formData.companyShort || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1">Logo</Typography>
          <Input
            type="file"
            name="logo"
            onChange={handleFormChange}
            fullWidth
            sx={{ border: '1px dashed #ccc', p: 2 }}
          />
        </Box>
        <TextField
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Emails"
          name="emails"
          value={formData.emails || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Config;