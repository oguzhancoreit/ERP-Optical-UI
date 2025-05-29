import { useEffect, useState, useCallback } from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import RoleFormModal from '../components/RoleFormModal';
import {
  getRolesPaged,
  createRole,
  updateRole,
  deleteRole,
} from '../api/role-api';
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
      alert('Kayıt işlemi başarısız.');
    }
  };

  const handleDelete = async (id) => {
    await deleteRole(id);
    fetchRoles();
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleCopy = (role) => {
    const copy = {
      ...role,
      id: undefined,
      name: `${role.name} (Kopya)`,
    };
    setSelectedRole(copy);
    setModalOpen(true);
  };

  const columns = [
    { field: 'name', headerName: 'Rol Adı', flex: 1.5 },
    {
      field: 'createdAt',
      headerName: 'Oluşturulma',
      flex: 1.2,
      renderCell: (params) => {
        const d = new Date(params.row.createdAt);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleString();
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
        disableBackdropClick
        disableEscapeKeyDown
      />
    </SidebarLayout>
  );
}
