import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, Grid, DialogTitle
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function BranchFormModal({ open, onClose, onSave, initialData }) {
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Şubeyi Güncelle' : 'Yeni Şube Ekle'}</DialogTitle>

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

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
