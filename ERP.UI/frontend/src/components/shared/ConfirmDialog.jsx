import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, useTheme, Stack
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ConfirmDialog({ open, title = 'Onay', message, onConfirm, onCancel }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          p: 2,
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <ErrorOutlineIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
          <DialogContentText sx={{ color: theme.palette.text.secondary }}>
            {message || 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?'}
          </DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Hayır
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Evet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
