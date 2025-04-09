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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
  flex: 1,
};

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
      <Box sx={modalStyle}>
        <Box sx={contentStyle}>
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