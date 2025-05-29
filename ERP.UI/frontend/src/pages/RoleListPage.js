import { useEffect, useState, useCallback } from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import RoleFormModal from '../components/RoleFormModal';
import { getRolesPaged, createRole, updateRole, deleteRole } from '../api/role-api';
import BaseListPage from '../components/shared/BaseListPage';

export default function RoleListPage({ darkMode, setDarkMode }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Listeyi çek
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRolesPaged(page + 1, pageSize, search);
      setRoles(res.items || []);
      setRowCount(res.totalCount || 0);
    } catch {
      alert('Roller yüklenemedi.');
    }
    setLoading(false);
  }, [page, pageSize, search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRoles();
    }, 400);
    return () => clearTimeout(delay);
  }, [fetchRoles]);

  // Ekle/güncelle
  const handleSave = async (formData) => {
    try {
      if (selectedRole?.id) {
        await updateRole(selectedRole.id, formData);
      } else {
        await createRole(formData);
        setPage(0);
      }
      setModalOpen(false);
      setSelectedRole(null);
      fetchRoles();
    } catch {
      alert('İşlem sırasında hata oluştu.');
    }
  };

  // Sil
  const handleDelete = async (id) => {
    await deleteRole(id);
    fetchRoles();
  };

  // Kopyala
  const handleCopy = (role) => {
    const copy = {
      ...role,
      id: undefined,
      name: `${role.name} (Kopya)`,
    };
    setSelectedRole(copy);
    setModalOpen(true);
  };

  // Düzenle
  const handleEdit = (role) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  // Kolonlar
  const columns = [
    { field: 'name', headerName: 'Ad', flex: 1 },
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
    },
  ];

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <BaseListPage
        title="Roller"
        columns={columns}
        rows={roles}
        rowCount={rowCount}
        loading={loading}
        onAdd={() => {
          setSelectedRole(null);
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

      <RoleFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRole(null);
        }}
        onSave={handleSave}
        initialData={selectedRole}
      />
    </SidebarLayout>
  );
}
