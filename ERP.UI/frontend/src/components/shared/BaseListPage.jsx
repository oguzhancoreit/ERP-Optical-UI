import {
  Box, Stack, Typography, TextField, IconButton, Tooltip, Button,
  Paper, useTheme
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo, useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/MapsUgcTwoTone';
import EditIcon from '@mui/icons-material/NextPlanTwoTone';
import DeleteIcon from '@mui/icons-material/HighlightOffTwoTone';
import ContentCopyIcon from '@mui/icons-material/CopyrightTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import FileDownloadIcon from '@mui/icons-material/FileDownloadTwoTone';


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import ConfirmDialog from './ConfirmDialog';

function DefaultNoRowsOverlay({ onAdd }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 3, color: 'text.secondary', height: '100%' }}>
      <SentimentDissatisfiedIcon sx={{ fontSize: 40 }} />
      <Typography variant="subtitle1" fontWeight="bold">Kayıt bulunamadı</Typography>
      {onAdd && <Button variant="outlined" startIcon={<AddIcon />} onClick={onAdd}>Yeni Kayıt Ekle</Button>}
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
  onPageSizeChange,
  getRowId = (row) => row.id,
  showSearch = true,
  extraActions,
  NoRowsOverlay,
}) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // FOCUS STATE
  const [focusRowId, setFocusRowId] = useState(null);

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

  const handleExportExcel = () => {
    const visibleColumns = columns.filter(col => col.field && col.headerName && col.field !== 'actions');
    const data = rows.map(row => {
      const rowData = {};
      visibleColumns.forEach(col => {
        rowData[col.headerName] = row[col.field];
      });
      return rowData;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sayfa1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${title || 'Tablo'}.xlsx`);
  };

  const extendedColumns = useMemo(() => {
    const actionsCol = (onEdit || onCopy || onDelete || extraActions) ? [{
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
          {extraActions && extraActions(params.row)}
        </Stack>
      )
    }] : [];
    return [...columns, ...actionsCol];
  }, [columns, onEdit, onCopy, onDelete, extraActions]);

  // Yeni ekleme: otomatik focus
  const handleAdd = () => {
    if (onAdd) {
      onAdd((newId) => {
        setTimeout(() => {
          if (newId) {
            setFocusRowId(newId);
          } else if (rows && rows.length > 0) {
            setFocusRowId(getRowId(rows[rows.length - 1]));
          }
        }, 150);
      });
    }
  };

  // Eğer dışarıdan odaklanmak istenirse veya rows değişirse focusRowId güncelle
  useEffect(() => {
    if (focusRowId && !rows.find(r => getRowId(r) === focusRowId)) {
      setFocusRowId(null);
    }
  }, [rows, focusRowId, getRowId]);

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">{title}</Typography>
        <Stack direction="row" spacing={1}>
          {onAdd && (
            <Button startIcon={<AddIcon />} variant="contained" size="large" color="primary" onClick={handleAdd}>Yeni</Button>
          )}
          <Tooltip title="Excel'e Aktar">
            <IconButton color="success" size="large" onClick={handleExportExcel}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {showSearch && (
        <TextField
          placeholder="Ara..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            endAdornment: search && (
              <IconButton size="small" onClick={() => onSearch('')}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          sx={{ mb: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}
        />
      )}

      <Paper elevation={2} sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}>
        {rows.length === 0 && !loading ? (
          NoRowsOverlay
            ? <NoRowsOverlay onAdd={handleAdd} />
            : <DefaultNoRowsOverlay onAdd={handleAdd} />
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
            getRowId={getRowId}
            disableRowSelectionOnClick

            // FOCUS HANDLING
            onRowClick={(params) => setFocusRowId(params.id)}
            onCellClick={(params) => setFocusRowId(params.id)}
            onRowEditStop={(params) => setFocusRowId(params.id)}
            onRowEditCommit={(id) => setFocusRowId(id)}
            getRowClassName={(params) =>
              focusRowId === params.id ? 'MuiDataGrid-row--focused' : ''
            }
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontWeight: 'bold',
                fontSize: 18,
                minHeight: 60,
                maxHeight: 60,
                lineHeight: '60px',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                  paddingY: 2,
                },
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
                cursor: 'pointer',
              },
              // FOCUS ROW STYLE: sadece background, bol ama "atlama" yok!
              '& .MuiDataGrid-row--focused': {
                backgroundColor: theme.palette.action.selected,
                fontWeight: 600,
                // border yok, padding yok, transition yok!
              },
              // Focus border ve outline tamamen kapalı!
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
                border: 'none !important',
              },
              '& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within': {
                outline: 'none !important',
                border: 'none !important',
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
