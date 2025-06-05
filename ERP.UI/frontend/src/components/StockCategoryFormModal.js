
import { useEffect, useState } from 'react';
import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';
import { generateStockCategoryCode } from '../api/stockCategory-api';

export default function StockCategoryFormModal({ open, onClose, onSave, initialData }) {
  const [dynamicInitialData, setDynamicInitialData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const isNew = !initialData?.id;

  useEffect(() => {
    const fetchInitialCode = async () => {
      if (isNew && open) {
        setLoading(true);
        try {
          const code = await generateStockCategoryCode();
          setDynamicInitialData({ code });
        } catch {
          setDynamicInitialData({});
        }
        setLoading(false);
      } else if (open) {
        setDynamicInitialData(initialData || {});
      }
    };
    fetchInitialCode();
    // eslint-disable-next-line
  }, [open, initialData]);

  const handleSave = async (data) => {
    try {
      await onSave(data);
    } catch (error) {
      if (error?.response?.status === 409) {
        throw error.response.data?.message || 'Kod veya ad zaten kullanımda.';
      }
      throw 'Kayıt sırasında bir hata oluştu.';
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      initialData={dynamicInitialData}
      title="Stock Category"
      loading={loading}
      fields={[
        { name: 'name', label: 'Name', required: true, maxLength: 100 },
      ]}
      validationSchema={Yup.object({
        name: Yup.string().required('Name gereklidir.'),
      })}
      successMessage="Stock Category başarıyla kaydedildi."
      errorMessage="Kayıt sırasında bir hata oluştu."
    />
  );
}
