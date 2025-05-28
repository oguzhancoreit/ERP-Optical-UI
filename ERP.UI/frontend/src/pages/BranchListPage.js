import { useEffect, useState, useCallback } from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import BranchFormModal from '../components/BranchFormModal';
import { getBranchesPaged, createBranch, updateBranch, deleteBranch } from '../api/branch-api';
import BaseListPage from '../components/shared/BaseListPage';

export default function BranchListPage({ darkMode, setDarkMode }) {
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
        setPage(0);
      }
      setModalOpen(false);
      setSelectedBranch(null);
      fetchBranches();
    } catch {
      alert('İşlem sırasında hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
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

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setModalOpen(true);
  };

  const columns = [
    { field: 'code', headerName: 'Kod', flex: 1 },
    { field: 'name', headerName: 'Ad', flex: 1 },
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

        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
    }
  ];

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <BaseListPage
        title="Şubeler"
        columns={columns}
        rows={branches}
        rowCount={rowCount}
        loading={loading}
        onAdd={() => {
          setSelectedBranch(null);
          setModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCopy={handleCopy}
        search={search}
        onSearch={setSearch}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

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
    </SidebarLayout>
  );
}
