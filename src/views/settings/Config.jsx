import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, TextField, Input, CircularProgress, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useConfigQuery, useUpdateConfigMutation, useStoreConfigMutation } from '../../store/services/settings';

const Config = () => {
  const navigate = useNavigate();
  const { data: configData, isLoading, isError, error } = useConfigQuery();
  console.log('Config data:', configData);
  const [updateConfig, { isLoading: isUpdating }] = useUpdateConfigMutation();
  const [storeConfig, { isLoading: isStoring }] = useStoreConfigMutation();

  const [formData, setFormData] = useState({
    lot_number_serial: '',
    invoice_cycle_in_days: '',
    invoice_cycle_due_days: '',
    company_full_name: '',
    company_short: '',
    contact_number: '',
    emails: '',
    address: '',
  });

  useEffect(() => {
    if (configData) {
      // If configData is an object, set it directly; if an array, use the first element.
      setFormData(Array.isArray(configData) ? configData[0] : configData);
    }
  }, [configData]);

  useEffect(() => {
    if (!isLoading && (!configData || (Array.isArray(configData) && configData.length === 0))) {
      storeConfig(formData).unwrap()
        .then((data) => setFormData(data))
        .catch((err) => console.error('Error storing config:', err));
    }
  }, [configData, isLoading, formData, storeConfig]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        invoice_cycle_in_days: parseInt(formData.invoice_cycle_in_days, 10),
        invoice_cycle_due_days: parseInt(formData.invoice_cycle_due_days, 10)
      };
      await updateConfig(payload).unwrap();
      navigate('/settings/config');
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  if (isLoading || isStoring) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error: {error.data?.message || 'Failed to load config'}</Alert>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>Config</Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Lot Number Serial"
          name="lot_number_serial"
          value={formData.lot_number_serial || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Invoice Cycle In Days"
          name="invoice_cycle_in_days"
          value={formData.invoice_cycle_in_days || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
          type="number"
        />
        <TextField
          label="Invoice Cycle Due Days"
          name="invoice_cycle_due_days"
          value={formData.invoice_cycle_due_days || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
          type="number"
        />
        <TextField
          label="Company Full Name"
          name="company_full_name"
          value={formData.company_full_name || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Company Short"
          name="company_short"
          value={formData.company_short || ''}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        {/* <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1">Logo</Typography>
          <Input
            type="file"
            name="logo"
            onChange={handleFormChange}
            fullWidth
            sx={{ border: '1px dashed #ccc', p: 2 }}
          />
        </Box> */}
        <TextField
          label="Contact Number"
          name="contact_number"
          value={formData.contact_number || ''}
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