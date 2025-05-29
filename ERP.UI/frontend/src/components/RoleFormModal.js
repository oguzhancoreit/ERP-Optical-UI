import { useEffect, useState } from 'react';
import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';

export default function RoleFormModal({ open, onClose, onSave, initialData }) {
  const [dynamicInitialData, setDynamicInitialData] = useState(initialData || {});
  const isNew = !initialData?.id;

  useEffect(() => {
    if (open) {
      setDynamicInitialData(initialData || {});
    }
  }, [open, initialData]);

  // onSave yalnızca başarılıysa devam eder, hata varsa throw eder!
  const handleSave = async (data) => {
    try {
      await onSave(data);
      // Success message BaseFormModal'dan yönetilecek
    } catch (error) {
      // Hata mesajını throw ile BaseFormModal'a ilet
      if (error?.response?.status === 409) {
        throw error.response.data?.message || 'Bu rol adı zaten kullanımda.';
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
      title="Rol"
      fields={[
        { name: 'name', label: 'Rol Adı', required: true, maxLength: 100 },
      ]}
      validationSchema={Yup.object({
        name: Yup.string().required('Rol adı gereklidir.'),
      })}
      successMessage="Rol başarıyla kaydedildi."
      errorMessage="Kayıt sırasında bir hata oluştu."
    />
  );
}
