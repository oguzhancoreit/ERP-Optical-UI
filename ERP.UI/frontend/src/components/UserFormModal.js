import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import BaseFormModal from './shared/BaseFormModal';

export default function UserFormModal({ open, onClose, onSave, initialData }) {
  const [dynamicInitialData, setDynamicInitialData] = useState({});

  const isNew = !initialData?.id;

  useEffect(() => {
    if (open) {
      if (initialData?.id) {
        setDynamicInitialData(initialData); // düzenleme modu
      } else {
        // yeni kullanıcı için başlangıç verisi
        setDynamicInitialData({
          fullName: '',
          email: '',
          password: '',
          roleIds: [],
          branchIds: []
        });
      }
    }
  }, [open, initialData]);

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={dynamicInitialData}
      title="Kullanıcı"
      fields={[
        { name: 'fullName', label: 'Ad Soyad', required: true, maxLength: 100 },
        { name: 'email', label: 'E-posta', required: true, maxLength: 100 },
        { name: 'password', label: 'Şifre', type: 'password', required: isNew, maxLength: 100 },
        {
          name: 'roleIds',
          label: 'Roller',
          type: 'select-multi',
          required: true,
          optionsUrl: '/roles',
          optionLabel: 'name',
          optionValue: 'id'
        },
        {
          name: 'branchIds',
          label: 'Şubeler',
          type: 'select-multi',
          required: true,
          optionsUrl: '/branches',
          optionLabel: 'name',
          optionValue: 'id'
        }
      ]}
      validationSchema={Yup.object({
        fullName: Yup.string().required('Ad Soyad zorunludur.'),
        email: Yup.string().email('Geçersiz e-posta').required('E-posta zorunludur.'),
        password: isNew
          ? Yup.string().min(6, 'Şifre en az 6 karakter olmalı').required('Şifre zorunludur.')
          : Yup.string(), // Güncelleme sırasında boş olabilir
        roleIds: Yup.array().min(1, 'En az bir rol seçilmelidir.'),
        branchIds: Yup.array().min(1, 'En az bir şube seçilmelidir.')
      })}
    />
  );
}
