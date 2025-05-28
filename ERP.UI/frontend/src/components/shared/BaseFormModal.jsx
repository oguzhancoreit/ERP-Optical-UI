import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, DialogTitle,
  IconButton, Box, CircularProgress, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useMemo } from 'react';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

// XSS filtreleme
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

  // initialValues artık dinamik, initialData'ya göre hesaplanıyor
  const initialValues = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = initialData?.[field.name] ?? '';
      return acc;
    }, {});
  }, [initialData, fields]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const cleanValues = Object.fromEntries(
        Object.entries(values).map(([key, val]) => [key, stripHtml(val)])
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
          {initialData ? `${title} Güncelle` : `Yeni ${title} Ekle`}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
              width: 40,
              height: 40,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <DialogContent dividers>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Box display="flex" flexDirection="column" gap={2}>
                {fields.map((field) => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    required={field.required}
                    multiline={field.multiline}
                    rows={field.rows}
                    inputProps={{ maxLength: field.maxLength }}
                    {...formik.getFieldProps(field.name)}
                    error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                    helperText={formik.touched[field.name] && formik.errors[field.name]}
                  />
                ))}
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
