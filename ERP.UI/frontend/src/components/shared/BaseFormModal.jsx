import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogTitle,
  IconButton,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Checkbox,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useMemo, useEffect } from 'react';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import axios from '../../services/axios-instance';

const stripHtml = (str) => str.replace(/<\/?[^>]+(>|$)/g, '');

export default function BaseFormModal({
  open,
  onClose,
  onSave,
  initialData,
  title,
  fields,
  validationSchema
}) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [optionsMap, setOptionsMap] = useState({});

  const initialValues = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = initialData?.[field.name] ?? (field.type === 'select-multi' ? [] : '');
      return acc;
    }, {});
  }, [initialData, fields]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const cleanValues = Object.fromEntries(
        Object.entries(values).map(([key, val]) =>
          [key, typeof val === 'string' ? stripHtml(val) : val]
        )
      );
      try {
        await onSave(cleanValues);
        setSnackbar({ open: true, message: `${title} başarıyla kaydedildi.`, severity: 'success' });
        onClose();
      } catch (error) {
        setSnackbar({ open: true, message: 'Kayıt sırasında bir hata oluştu.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    fields.forEach((field) => {
      if ((field.type === 'select' || field.type === 'select-multi') && field.optionsUrl) {
        axios.get(field.optionsUrl)
          .then(res => {
            setOptionsMap(prev => ({
              ...prev,
              [field.name]: res.data || []
            }));
          })
          .catch(() => {
            setOptionsMap(prev => ({ ...prev, [field.name]: [] }));
          });
      }
    });
  }, [fields]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const renderField = (field) => {
    const {
      name,
      label,
      required,
      type = 'text',
      multiline,
      rows,
      maxLength,
      optionLabel = 'name',
      optionValue = 'id'
    } = field;

    const value = formik.values[name];
    const error = formik.touched[name] && Boolean(formik.errors[name]);
    const helperText = formik.touched[name] && formik.errors[name];

    const options = optionsMap[name] || [];

    if (type === 'select-multi') {
      return (
        <TextField
          key={name}
          select
          fullWidth
          label={label}
          name={name}
          value={value}
          onChange={(e) => formik.setFieldValue(name, e.target.value)}
          onBlur={formik.handleBlur}
          margin="normal"
          error={error}
          helperText={helperText}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => {
              const selectedItems = options.filter(opt => selected.includes(opt[optionValue]));
              return selectedItems.map(opt => opt[optionLabel]).join(', ');
            }
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt[optionValue]} value={opt[optionValue]}>
              <Checkbox checked={value.includes(opt[optionValue])} size="small" />
              <ListItemText primary={opt[optionLabel]} />
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (type === 'select') {
      return (
        <TextField
          key={name}
          select
          fullWidth
          label={label}
          name={name}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          margin="normal"
          error={error}
          helperText={helperText}
        >
          {options.map((opt) => (
            <MenuItem key={opt[optionValue]} value={opt[optionValue]}>
              {opt[optionLabel]}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        key={name}
        fullWidth
        type={type}
        name={name}
        label={label}
        value={value}
        required={required}
        multiline={multiline}
        rows={rows}
        inputProps={{ maxLength }}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        margin="normal"
        error={error}
        helperText={helperText}
      />
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}}
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown
      >
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
            {initialData?.id ? `${title} Güncelle` : `Yeni ${title} Ekle`}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                backgroundColor: 'error.main',
                color: 'white',
                '&:hover': { backgroundColor: 'error.dark' },
                width: 40,
                height: 40,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Box display="flex" flexDirection="column" gap={2}>
                {fields.map(renderField)}
              </Box>
            </motion.div>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="inherit" disableElevation>
              İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Kaydet
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
