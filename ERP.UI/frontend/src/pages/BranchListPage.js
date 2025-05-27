import {
  Box, Button, Typography, Stack, useTheme, IconButton,
  Tooltip, Paper, TextField, Chip, InputAdornment,
  CircularProgress
} from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import {
  getBranchesPaged, createBranch, updateBranch, deleteBranch
} from '../api/branch-api';

import SidebarLayout from '../layouts/SidebarLayout';
import BranchFormModal from '../components/BranchFormModal';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

function CustomNoRowsOverlay() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{ mt: 3, color: 'text.secondary', height: '100%' }}
    >
      <SentimentDissatisfiedIcon sx={{ fontSize: 40 }} />
      <Typography variant="subtitle1" fontWeight="bold">
        Kayıt bulunamadı
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Yeni kayıt eklemek için "Yeni Şube" butonunu kullanabilirsiniz.
      </Typography>
    </Stack>
  );
}

export default function BranchListPage({ darkMode, setDarkMode }) {
  const theme = useTheme();

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBranchesPaged(page + 1, pageSize, search);
      setBranches(res.items || []);
      setRowCount(res.totalCount || 0);
    } catch {
      alert('Şubeler yüklenemedi.');
    }
    setLoading(false);
  }, [page, pageSize, search]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBranches();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchBranches]);

  const handleSave = async (formData) => {
    try {
      if (selectedBranch?.id) {
        await updateBranch(selectedBranch.id, formData);
      } else {
        await createBranch(formData);
      }
      setModalOpen(false);
      setSelectedBranch(null);
      fetchBranches();
    } catch {
      alert('İşlem sırasında hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu şubeyi silmek istiyor musunuz?')) return;
    await deleteBranch(id);
    fetchBranches();
  };

  const handleCopy = (branch) => {
    const copy = {
      ...branch,
      id: undefined,
      name: `${branch.name} (Kopya)`,
      code: `${branch.code}-copy`,
    };
    setSelectedBranch(copy);
    setModalOpen(true);
  };

  const columns = [
    { field: 'name', headerName: 'Ad', flex: 1 },
    { field: 'code', headerName: 'Kod', flex: 1 },
    { field: 'address', headerName: 'Adres', flex: 2 },
    {
      field: 'createdAt',
      headerName: 'Oluşturulma',
      flex: 1.2,
      sortable: true,
      renderCell: (params) => {
        const rawDate = params.row?.createdAt || params.row?.CreatedAt;
        if (!rawDate) return '-';

        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return 'Invalid Date';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;

        return (
          <Chip
            label={formatted}
            size="small"
            color={theme.palette.mode === 'dark' ? 'default' : 'primary'}
            sx={{
              fontWeight: 'bold',
              backgroundColor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : undefined,
              color: theme.palette.mode === 'dark' ? '#eee' : undefined,
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"      
          justifyContent="center"  
          sx={{ height: '100%', width: '100%' }}
        >
          <Tooltip title="Düzenle">
            <IconButton
              color="primary"
              onClick={() => {
                setSelectedBranch(params.row);
                setModalOpen(true);
              }}
              sx={{ width: 32, height: 32, boxShadow: (theme) => theme.shadows[2] }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Kopyala">
            <IconButton
              color="success"
              onClick={() => handleCopy(params.row)}
              sx={{ width: 32, height: 32, boxShadow: (theme) => theme.shadows[2] }}
              size="small"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
              sx={{ width: 32, height: 32, boxShadow: (theme) => theme.shadows[2] }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    }
  ];

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">Şubeler</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            size="large"
            color="primary"
            onClick={() => {
              setSelectedBranch(null);
              setModalOpen(true);
            }}
          >
            Yeni Şube
          </Button>
        </Stack>

        <TextField
          placeholder="Şube ara..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,            endAdornment: search && (
              <IconButton
                size="small"
                onClick={() => setSearch('')}
                aria-label="Temizle"
              >
                <ClearIcon />
              </IconButton>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ height: '100%' }}>
            {branches.length === 0 && !loading ? (
              <CustomNoRowsOverlay />
            ) : (
              <DataGrid
                rows={branches}
                columns={columns}
                rowCount={rowCount}
                loading={loading}
                paginationMode="server"
                page={page}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(0);
                }}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                sx={{
                  height: '100%',
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(90deg, #27334d, #1c2535)'
                        : 'linear-gradient(90deg, #e3f2fd, #bbdefb)',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.action.hover,
                    cursor: 'pointer',
                  },
                }}
              />
            )}
          </Paper>
        </Box>

        <BranchFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedBranch(null);
          }}
          onSave={handleSave}
          initialData={selectedBranch}
          disableBackdropClick
          disableEscapeKeyDown
        />
      </Box>
    </SidebarLayout>
  );
}
