import { useEffect, useState, useCallback } from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import UserFormModal from '../components/UserFormModal';
import {
  getUsersPaged,
  createUser,
  updateUser,
  deleteUser,
} from '../api/user-api';
import BaseListPage from '../components/shared/BaseListPage';

export default function UserListPage({ darkMode, setDarkMode }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsersPaged(page + 1, pageSize, search);
      setUsers(res.items || []);
      setRowCount(res.totalCount || 0);
    } catch {
      alert('Kullanıcılar yüklenemedi.');
    }
    setLoading(false);
  }, [page, pageSize, search]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchUsers]);

  const handleSave = async (formData) => {
    try {
      if (selectedUser?.id) {
        await updateUser(selectedUser.id, formData);
      } else {
        await createUser(formData);
        setPage(0);
      }
      setModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      alert('İşlem sırasında hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleCopy = (user) => {
    const copy = {
      ...user,
      id: undefined,
      fullName: `${user.fullName} (Kopya)`,
      email: `copy_of_${user.email}`,
    };
    setSelectedUser(copy);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const columns = [
    { field: 'fullName', headerName: 'Ad Soyad', flex: 1 },
    { field: 'email', headerName: 'E-posta', flex: 1.5 },
    {
      field: 'roles',
      headerName: 'Roller',
      flex: 1.2,
      valueGetter: (params) => {
        const roles = params?.row?.roles;
        return Array.isArray(roles) ? roles.join(', ') : '-';
      },
    },
    {
      field: 'branches',
      headerName: 'Şubeler',
      flex: 1.5,
      valueGetter: (params) => {
        const branches = params?.row?.branches;
        return Array.isArray(branches) ? branches.join(', ') : '-';
      },
    },
    {
      field: 'createdAt',
      headerName: 'Oluşturulma',
      flex: 1.2,
      renderCell: (params) => {
        const rawDate = params.row?.createdAt;
        if (!rawDate) return '-';
        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return 'Geçersiz';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
          d.getMinutes()
        ).padStart(2, '0')}`;
      },
    },
  ];

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <BaseListPage
        title="Kullanıcılar"
        columns={columns}
        rows={users}
        rowCount={rowCount}
        loading={loading}
        onAdd={() => {
          setSelectedUser(null);
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

      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
        initialData={selectedUser}
        disableBackdropClick
        disableEscapeKeyDown
      />
    </SidebarLayout>
  );
}
