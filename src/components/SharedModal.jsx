import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SharedModal = ({
  open,
  onClose,
  title,
  formData,
  onChange,
  onSubmit,
  mode,
}) => {
  const isViewMode = mode === 'view';

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={3}>
          {title}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              fullWidth
              required
              disabled={isViewMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={onChange}
              fullWidth
              multiline
              rows={2}
              disabled={isViewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={onChange}
              fullWidth
              disabled={isViewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Discount %"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={onChange}
              fullWidth
              required
              disabled={isViewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Opening Balance Date"
                value={formData.openingBalanceDate ? dayjs(formData.openingBalanceDate) : null}
                onChange={(date) =>
                  onChange({
                    target: {
                      name: 'openingBalanceDate',
                      value: date ? date.format('YYYY-MM-DD') : '',
                    },
                  })
                }
                renderInput={(params) => <TextField {...params} fullWidth required />}
                disabled={isViewMode}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Opening Balance"
              name="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={onChange}
              fullWidth
              required
              disabled={isViewMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={onChange}
              fullWidth
              multiline
              rows={2}
              disabled={isViewMode}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.active}
                  onChange={(e) => onChange({ target: { name: 'active', value: e.target.checked } })}
                  disabled={isViewMode}
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {!isViewMode && (
            <>
              <Button variant="contained" onClick={onSubmit}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => onChange({ reset: true })}>
                Reset
              </Button>
            </>
          )}
          <Button variant="outlined" onClick={onClose}>
            {isViewMode ? 'Close' : 'Cancel'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SharedModal;