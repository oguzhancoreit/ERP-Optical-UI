import {
  Box, Stack, Typography, TextField, IconButton, Tooltip, Button,
  Paper, Chip, useTheme
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

import ConfirmDialog from './ConfirmDialog';

function DefaultNoRowsOverlay({ onAdd }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 3, color: 'text.secondary', height: '100%' }}>
      <SentimentDissatisfiedIcon sx={{ fontSize: 40 }} />
      <Typography variant="subtitle1" fontWeight="bold">Kayıt bulunamadı</Typography>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={onAdd}>Yeni Kayıt Ekle</Button>
    </Stack>
  );
}

export default function BaseListPage({
  title,
  columns,
  rows,
  rowCount,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onCopy,
  search,
  onSearch,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDeleteRequest = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && selectedId !== null) {
      onDelete(selectedId);
    }
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const extendedColumns = useMemo(() => {
    return [
      ...columns,
      {
        field: 'actions',
        headerName: 'İşlemler',
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} alignItems="center">
            {onEdit && (
              <Tooltip title="Düzenle">
                <IconButton color="primary" onClick={() => onEdit(params.row)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onCopy && (
              <Tooltip title="Kopyala">
                <IconButton color="success" onClick={() => onCopy(params.row)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Sil">
                <IconButton color="error" onClick={() => handleDeleteRequest(params.row.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        )
      }
    ];
  }, [columns, onEdit, onCopy, onDelete]);

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">{title}</Typography>
        {onAdd && (
          <Button startIcon={<AddIcon />} variant="contained" size="large" color="primary" onClick={onAdd}>Yeni</Button>
        )}
      </Stack>

      <TextField
        placeholder="Ara..."
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,            endAdornment: search && (
            <IconButton size="small" onClick={() => onSearch('')}>
              <ClearIcon />
            </IconButton>
          ),
        }}
        sx={{ mb: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}
      />

      <Paper elevation={2} sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}>
        {rows.length === 0 && !loading ? (
          <DefaultNoRowsOverlay onAdd={onAdd} />
        ) : (
          <DataGrid
            rows={rows}
            columns={extendedColumns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={(newSize) => {
              onPageSizeChange(newSize);
              onPageChange(0);
            }}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontWeight: 'bold'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
                cursor: 'pointer',
              },
            }}
          />
        )}
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Silme Onayı"
        message="Bu kaydı silmek istediğinize emin misiniz?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}