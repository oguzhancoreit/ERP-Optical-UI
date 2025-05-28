import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';

export default function BranchFormModal({ open, onClose, onSave, initialData }) {
  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
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