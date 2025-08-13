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
  MenuItem,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const modalStyle = (fullWidth = false, fullScreen = false) => ({
  position: 'absolute',
  top: fullScreen ? '0' : '50%',
  left: fullScreen ? '0' : '50%',
  transform: fullScreen ? 'none' : 'translate(-50%, -50%)',
  width: fullScreen ? '100%' : (fullWidth ? '90%' : 800),
  height: fullScreen ? '100%' : 'auto',
  maxHeight: fullScreen ? '100%' : '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: fullScreen ? 0 : 2,
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
});

const contentStyle = (fullScreen = false) => ({
  p: 4,
  maxHeight: fullScreen ? 'calc(100vh - 136px)' : '70vh',
  overflowY: 'auto',
  flex: 1,
  width: '100%',
  overflowX: 'auto',
});

const SharedModal = ({
  open,
  onClose,
  title,
  formData,
  onChange,
  onSubmit,
  mode,
  fields,
  renderCustomContent,
  fullWidth = false,
  fullScreen = false,
}) => {
  const isViewMode = mode === 'view';

  const renderField = (field) => {
    const { name, label, type = 'text', options, multiline, rows, required, xs = 12, sm } = field;
    const value = formData[name];

    if (type === 'select') {
      return (
        <TextField
          select
          label={label}
          name={name}
          value={value || ''}
          onChange={onChange}
          fullWidth
          required={required}
          disabled={isViewMode}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (type === 'date') {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            value={value ? dayjs(value) : null}
            onChange={(date) =>
              onChange({
                target: {
                  name,
                  value: date ? date.format('YYYY-MM-DD') : '',
                },
              })
            }
            renderInput={(params) => <TextField {...params} fullWidth required={required} />}
            disabled={isViewMode}
          />
        </LocalizationProvider>
      );
    }

    if (type === 'checkbox') {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value || false}
              onChange={(e) => onChange({ target: { name, value: e.target.checked } })}
              disabled={isViewMode}
            />
          }
          label={label}
        />
      );
    }

    return (
      <TextField
        label={label}
        name={name}
        type={type}
        value={value || (type === 'number' ? 0 : '')}
        onChange={onChange}
        fullWidth
        multiline={multiline}
        rows={rows}
        required={required}
        disabled={isViewMode}
      />
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle(fullWidth, fullScreen)}>
        <Box sx={contentStyle(fullScreen)}>
          <Typography variant="h6" mb={3}>
            {title}
          </Typography>
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={field.xs || 12} sm={field.sm} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
          {renderCustomContent && (
            <Box sx={{ mt: 3 }}>
              {renderCustomContent({ formData, onChange, isViewMode })}
            </Box>
          )}
        </Box>
        <Box sx={{ p: 4, pt: 0, display: 'flex', gap: 2 }}>
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