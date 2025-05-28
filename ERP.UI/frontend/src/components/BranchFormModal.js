import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, Grid, DialogTitle, useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function BranchFormModal({ open, onClose, onSave, initialData }) {
  const theme = useTheme();

  const [form, setForm] = useState({
    name: '',
    code: '',
    address: '',
  });

  useEffect(() => {
    if (open) {
      setForm(initialData || { name: '', code: '', address: '' });
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{
      sx: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary
      }
    }}>
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.divider}` }}>
        {initialData ? 'Şubeyi Güncelle' : 'Yeni Şube Ekle'}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              label="Şube Adı"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
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
              variant="outlined"
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
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
              variant="outlined"
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
