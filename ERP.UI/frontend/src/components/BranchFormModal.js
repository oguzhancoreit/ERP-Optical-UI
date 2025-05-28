import { useEffect, useState } from 'react';
import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';
import { generateBranchCode } from '../api/branch-api';

export default function BranchFormModal({ open, onClose, onSave, initialData }) {
  const [dynamicInitialData, setDynamicInitialData] = useState(initialData || {});
  const isNew = !initialData?.id;

  useEffect(() => {
    const fetchInitialCode = async () => {
      if (isNew && open) {
        try {
          const code = await generateBranchCode(); // DEFAULT storeCode kullanılır
          setDynamicInitialData({ code });
        } catch {
          setDynamicInitialData({});
        }
      } else if (open) {
        setDynamicInitialData(initialData || {});
      }
    };

    fetchInitialCode();
  }, [open, initialData]);

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={dynamicInitialData}
      title="Şube"
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
    />
  );
}
