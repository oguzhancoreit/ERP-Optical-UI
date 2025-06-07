import {
  Box, Stack, Typography, TextField, IconButton, Tooltip, Button,
  Paper, useTheme, useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo, useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/MapsUgcTwoTone';
import EditIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import FileDownloadIcon from '@mui/icons-material/FileDownloadTwoTone';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import ConfirmDialog from './ConfirmDialog';
import Checkbox from '@mui/material/Checkbox';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Boolean (checkbox) için kolonları wrap'le
  const boolWrappedColumns = useMemo(() => {
    return columns.map(col => {
      if (col.type === 'boolean') {
        return {
          ...col,
          align: 'center',
          headerAlign: 'center',
          sortable: col.sortable !== false,
          renderCell: (params) => (
            <Checkbox
              checked={Boolean(params.value)}
              disabled
              color="primary"
              size="small"
              inputProps={{ 'aria-label': 'boolean value' }}
            />
          )
        };
      }
      return col;
    });
  }, [columns]);

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
              <IconButton color="primary" onClick={() => onCopy(params.row)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Sil">
              <IconButton color="primary" onClick={() => handleDeleteRequest(params.row.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {extraActions && extraActions(params.row)}
        </Stack>
      )
    }] : [];
    return [...boolWrappedColumns, ...actionsCol];
  }, [boolWrappedColumns, onEdit, onCopy, onDelete, extraActions]);

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

  useEffect(() => {
    if (focusRowId && !rows.find(r => getRowId(r) === focusRowId)) {
      setFocusRowId(null);
    }
  }, [rows, focusRowId, getRowId]);

  return (
    <Box
      sx={{
        height: { xs: 'auto', md: 'calc(100vh - 120px)' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        p: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent={isMobile ? 'flex-start' : 'space-between'}
        alignItems={isMobile ? 'stretch' : 'center'}
        spacing={isMobile ? 1 : 0}
        mb={2}
      >
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" mb={isMobile ? 1 : 0}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent={isMobile ? "flex-start" : "flex-end"}>
          {onAdd && (
            <Button startIcon={<AddIcon />} variant="contained" size={isMobile ? "medium" : "large"} color="primary" onClick={handleAdd}>
              {isMobile ? '' : 'Yeni'}
            </Button>
          )}
          <Tooltip title="Excel'e Aktar">
            <IconButton color="primary" size={isMobile ? "medium" : "large"} onClick={handleExportExcel}>
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
          sx={{
            mb: 2,
          }}
        />
      )}

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          backgroundColor: 'background.paper',
          minHeight: 240,
          p: 0,
          borderRadius: 0,
          width: '100%',
          overflowX: 'auto'
        }}
      >
        <Box sx={{ width: '100%', height: isMobile ? 400 : '100%' }}>
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
              autoHeight={isMobile}
            />
          )}
        </Box>
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
