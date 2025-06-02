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
  MenuItem,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
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
  validationSchema,
  loading: externalLoading,
  successMessage = "Kayıt başarıyla tamamlandı.",
  errorMessage = "Kayıt sırasında bir hata oluştu."
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [optionsMap, setOptionsMap] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        setSnackbar({ open: true, message: successMessage, severity: 'success' });
        onClose();
      } catch (error) {
        let msg = errorMessage;
        if (typeof error === "string") msg = error;
        else if (error?.response?.data?.message) msg = error.response.data.message;
        setSnackbar({ open: true, message: msg, severity: 'error' });
      } finally {
        setLoading(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
    // eslint-disable-next-line
  }, [open]);

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

    const autoCompleteValue =
      field.autoComplete ||
      (name.toLowerCase().includes('password') || name.toLowerCase().includes('email') ? 'new-password' : 'off');

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
          size={isMobile ? "small" : "medium"}
          sx={{
            fontSize: isMobile ? '0.96rem' : undefined,
            mb: isMobile ? 1 : 2,
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
          autoComplete={autoCompleteValue}
          size={isMobile ? "small" : "medium"}
          sx={{
            fontSize: isMobile ? '0.96rem' : undefined,
            mb: isMobile ? 1 : 2,
          }}
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
        autoComplete={autoCompleteValue}
        disabled={externalLoading || loading}
        size={isMobile ? "small" : "medium"}
        sx={{
          fontSize: isMobile ? '0.96rem' : undefined,
          mb: isMobile ? 1 : 2,
        }}
      />
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}} // ESC ve backdrop disable
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 3 },
            borderRadius: { xs: 0, sm: 3 },
          }
        }}
      >
        <form
          key={JSON.stringify(initialValues)}
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <DialogTitle
            sx={{
              m: 0,
              p: isMobile ? 2 : 3,
              fontWeight: 'bold',
              fontSize: isMobile ? '1.2rem' : '1.3rem',
            }}
          >
            {initialData?.id ? `${title} Güncelle` : `Yeni ${title} Ekle`}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                backgroundColor: '#212121',
                color: '#fff',
                border: '2px solid #FF1744',
                borderRadius: '4px',
                width: 32,
                height: 32,
                minWidth: 0,
                minHeight: 0,
                boxShadow: 'none',
                padding: 0,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#FF1744',
                  color: '#fff',
                  border: '2px solid #212121',
                  boxShadow: 'none',
                },
                outline: '1px solid #fff',
                outlineOffset: '-3px',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              px: isMobile ? 2 : 3,
              py: isMobile ? 1.5 : 2.5,
              maxHeight: isMobile ? 'unset' : '60vh',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Box display="flex" flexDirection="column" gap={isMobile ? 1 : 2}>
                {fields.map(renderField)}
              </Box>
            </motion.div>
          </DialogContent>

          <DialogActions
            sx={{
              p: isMobile ? 1 : 2,
              borderTop: '1px solid #eee',
              position: isMobile ? 'sticky' : 'static',
              bottom: 0,
              bgcolor: isMobile ? theme.palette.background.paper : 'inherit',
            }}
          >
            <Button onClick={onClose} color="inherit" disableElevation size={isMobile ? 'small' : 'medium'}>
              İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              disabled={externalLoading || loading}
              startIcon={(externalLoading || loading) ? <CircularProgress size={20} color="inherit" /> : null}
              size={isMobile ? 'small' : 'medium'}
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
        anchorOrigin={{ vertical: isMobile ? 'top' : 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
