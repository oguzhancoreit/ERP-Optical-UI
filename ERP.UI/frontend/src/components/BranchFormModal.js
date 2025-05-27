import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, Grid, useTheme, Box, Typography, Paper, IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';

export default function BranchFormModal({ open, onClose, onSave, initialData }) {
  const theme = useTheme();

  const [form, setForm] = useState({
    name: '',
    code: '',
    address: '',
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm(initialData);
      } else {
        setForm({ name: '', code: '', address: '' });
      }
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.code) {
      alert('Ad ve Kod alanları zorunludur.');
      return;
    }
    onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: Paper,
        elevation: 20,
        sx: {
          border: `3px solid ${theme.palette.primary.dark}`,
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: `0 12px 32px rgba(0, 0, 0, 0.3)`
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        py={1.5}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #1e293b 0%, #273d5d 100%)'
            : 'linear-gradient(90deg, #dbe9f6 0%, #a8cbee 100%)',
          borderBottom: `2px solid ${theme.palette.primary.main}`,
        }}
      >
        <Box display="flex" alignItems="center">
          <BusinessIcon color="primary" sx={{ mr: 1, fontSize: 26 }} />
          <Typography variant="h6" fontWeight="600">
            {initialData ? 'Şubeyi Güncelle' : 'Yeni Şube Ekle'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="medium" color="secondary">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers sx={{ px: 4, py: 3 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              label="Şube Adı"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item>
            <TextField
              label="Şube Kodu"
              name="code"
              value={form.code}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item>
            <TextField
              label="Adres"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2.5, backgroundColor: theme.palette.action.hover }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          startIcon={<CloseIcon />}
          sx={{ fontWeight: 'bold' }}
        >
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          sx={{ fontWeight: 'bold' }}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
