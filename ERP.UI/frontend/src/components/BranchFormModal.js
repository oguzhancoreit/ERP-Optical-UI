import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, DialogTitle,
  IconButton, Box, CircularProgress, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

// XSS filtreleme
const stripHtml = (str) => str.replace(/<\/?[^>]+(>|$)/g, '');

export default function BranchFormModal({ open, onClose, onSave, initialData }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      address: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Şube adı gereklidir.'),
      code: Yup.string().required('Şube kodu gereklidir.'),
      address: Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const cleanValues = {
        name: stripHtml(values.name),
        code: stripHtml(values.code),
        address: stripHtml(values.address),
      };
      try {
        await onSave(cleanValues);
        setSnackbar({ open: true, message: 'Şube başarıyla kaydedildi.', severity: 'success' });
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
    if (open) {
      if (initialData) {
        formik.setValues(initialData);
      } else {
        formik.resetForm(); // yeni kayıt için alanları temizle
      }
    }
  }, [open, initialData]);

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
          {initialData ? 'Şubeyi Güncelle' : 'Yeni Şube Ekle'}
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
                <TextField
                  label="Şube Kodu"
                  name="code"
                  fullWidth
                  required
                  autoComplete="off"
                  inputProps={{ maxLength: 20 }}
                  {...formik.getFieldProps('code')}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
                <TextField
                  label="Şube Adı"
                  name="name"
                  fullWidth
                  required
                  autoComplete="off"
                  inputProps={{ maxLength: 100 }}
                  {...formik.getFieldProps('name')}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  label="Adres"
                  name="address"
                  fullWidth
                  multiline
                  rows={2}
                  autoComplete="off"
                  inputProps={{ maxLength: 200 }}
                  {...formik.getFieldProps('address')}
                />
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
