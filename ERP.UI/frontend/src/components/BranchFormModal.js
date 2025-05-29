import { useEffect, useState } from 'react';
import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';
import { generateBranchCode } from '../api/branch-api';

export default function BranchFormModal({ open, onClose, onSave, initialData }) {
  const [dynamicInitialData, setDynamicInitialData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const isNew = !initialData?.id;

  useEffect(() => {
    const fetchInitialCode = async () => {
      if (isNew && open) {
        setLoading(true);
        try {
          const code = await generateBranchCode();
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

  // onSave artık sadece throw eder veya başarılı olur;
  // mesajlar BaseFormModal'dan gösterilir.
  const handleSave = async (data) => {
    try {
      await onSave(data);
      // Başarı durumunda mesaj, BaseFormModal'un successMessage prop'u ile gösterilecek.
    } catch (error) {
      // Hata durumunda mesajı fırlat:
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
      title="Şube"
      loading={loading}
      fields={[
        { name: 'code', label: 'Şube Kodu', required: true, maxLength: 20 },
        { name: 'name', label: 'Şube Adı', required: true, maxLength: 100 },
        { name: 'address', label: 'Adres', multiline: true, rows: 2, maxLength: 200 },
      ]}
      validationSchema={Yup.object({
        code: Yup.string().required('Şube kodu gereklidir.'),
        name: Yup.string().required('Şube adı gereklidir.'),
        address: Yup.string(),
      })}
      successMessage="Şube başarıyla kaydedildi."
      errorMessage="Kayıt sırasında bir hata oluştu."
    />
  );
}
