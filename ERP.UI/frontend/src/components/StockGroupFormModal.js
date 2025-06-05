
import { useEffect, useState } from 'react';
import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';

export default function StockGroupFormModal({ open, onClose, onSave, initialData }) {
  const [dynamicInitialData, setDynamicInitialData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const isNew = !initialData?.id;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (open) {
        setDynamicInitialData(initialData || {});
      }
    };
    fetchInitialData();
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
      title="Stock Group"
      loading={loading}
      fields={[
        { name: 'code', label: 'Code', required: true, maxLength: 100 },
        { name: 'name', label: 'Name', required: true, maxLength: 100 },
      ]}
      validationSchema={Yup.object({
        code: 
            Yup.string().required('Code gereklidir.').max(100, 'Code en fazla 100 karakter olmalı.')
,
        name: 
            Yup.string().required('Name gereklidir.').max(100, 'Name en fazla 100 karakter olmalı.')
,
      })}
      successMessage="Stock Group başarıyla kaydedildi."
      errorMessage="Kayıt sırasında bir hata oluştu."
    />
  );
}
