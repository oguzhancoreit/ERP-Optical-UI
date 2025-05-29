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

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={dynamicInitialData}
      title="Rol"
      fields={[
        { name: 'name', label: 'Rol Adı', required: true, maxLength: 100 },
      ]}
      validationSchema={Yup.object({
        name: Yup.string().required('Rol adı gereklidir.'),
      })}
    />
  );
}
