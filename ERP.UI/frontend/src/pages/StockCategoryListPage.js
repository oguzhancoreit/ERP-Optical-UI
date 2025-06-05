import { useEffect, useState, useCallback } from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import StockCategoryFormModal from '../components/StockCategoryFormModal';
import {
  getStockCategoryPaged, // doğru isimle import et
  createStockCategory,
  updateStockCategory,
  deleteStockCategory
} from '../api/stockCategory-api';
import BaseListPage from '../components/shared/BaseListPage';

export default function StockCategoryListPage({ darkMode, setDarkMode }) {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Verileri çek
  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStockCategoryPaged(page + 1, pageSize, search);
      setRows(res.items || []);
      setRowCount(res.totalCount || 0);
    } catch {
      alert('Stock Category verileri yüklenemedi.');
    }
    setLoading(false);
  }, [page, pageSize, search]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRows();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchRows]);

  // Kaydet (yeni/güncelle)
  const handleSave = async (formData) => {
    try {
      if (selected?.id) {
        await updateStockCategory(selected.id, formData);
      } else {
        await createStockCategory(formData);
        setPage(0);
      }
      setModalOpen(false);
      setSelected(null);
      fetchRows();
    } catch {
      alert('İşlem sırasında hata oluştu.');
    }
  };

  // SİLME işlemi -- SADECE id parametresi bekler!
  const handleDelete = async (id) => {
    await deleteStockCategory(id);
    fetchRows();
  };

  const handleCopy = (row) => {
    const copy = {
      ...row,
      id: undefined,
      name: `${row.name || ''} (Kopya)`
    };
    setSelected(copy);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setModalOpen(true);
  };

  const columns = [
    { field: 'name', headerName: 'Kategori Adı', flex: 1 },
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
      {/* <pre>{JSON.stringify(rows, null, 2)}</pre>  // debug için açabilirsin */}
      <BaseListPage
        title="Stok Kategorileri"
        columns={columns}
        rows={rows}
        rowCount={rowCount}
        loading={loading}
        onAdd={() => {
          setSelected(null);
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
      <StockCategoryFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSave={handleSave}
        initialData={selected}
      />
    </SidebarLayout>
  );
}
