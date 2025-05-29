import { useEffect, useState } from 'react';
import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';

export default function UserFormModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {});
  const isNew = !initialData?.id;

  useEffect(() => {
    if (open) {
      setFormData(initialData || {});
    }
  }, [open, initialData]);

  const handleSave = async (data) => {
    try {
      await onSave(data);
      // Success mesajı BaseFormModal'dan gösterilecek
    } catch (error) {
      if (error?.response?.status === 409) {
        throw error.response.data?.message || 'Bu e-posta zaten kullanılıyor.';
      }
      throw 'Kayıt sırasında bir hata oluştu.';
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      initialData={formData}
      title="Kullanıcı"
      fields={[
        {
          name: 'fullName',
          label: 'Ad Soyad',
          required: true,
          maxLength: 100,
        },
        {
          name: 'email',
          label: 'E-posta',
          type: 'email',
          required: true,
          maxLength: 150,
          autoComplete: 'off',
        },
        {
          name: 'password',
          label: isNew ? 'Şifre' : 'Şifre (güncellenecekse)',
          type: 'password',
          required: isNew,
          maxLength: 100,
          autoComplete: 'new-password',
        },
        {
          name: 'roleIds',
          label: 'Roller',
          type: 'select-multi',
          optionsUrl: '/roles',
          optionLabel: 'name',
          optionValue: 'id',
          required: true,
        },
        {
          name: 'branchIds',
          label: 'Şubeler',
          type: 'select-multi',
          optionsUrl: '/branches',
          optionLabel: 'name',
          optionValue: 'id',
          required: true,
        },
      ]}
      validationSchema={Yup.object({
        fullName: Yup.string().required('Ad soyad gereklidir.'),
        email: Yup.string()
          .email('Geçerli bir e-posta giriniz.')
          .required('E-posta gereklidir.'),
        password: isNew
          ? Yup.string().required('Şifre gereklidir.').min(6, 'En az 6 karakter olmalı.')
          : Yup.string(),
        roleIds: Yup.array().min(1, 'En az bir rol seçilmelidir.'),
        branchIds: Yup.array().min(1, 'En az bir şube seçilmelidir.'),
      })}
      successMessage="Kullanıcı başarıyla kaydedildi."
      errorMessage="Kayıt sırasında bir hata oluştu."
    />
  );
}
