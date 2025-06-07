
import { useEffect, useState } from 'react';
import BaseFormModal from './shared/BaseFormModal';
import * as Yup from 'yup';


export default function UnitFormModal({ open, onClose, onSave, initialData }) {
  const [dynamicInitialData, setDynamicInitialData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const isNew = !initialData?.id;

  useEffect(() => {
    async function fetchInitialData() {
      if (open) {
        setDynamicInitialData(initialData || {});
      }
    }
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
      title="Unit"
      loading={loading}
      fields={[
        {
          name: 'code',
                    label: 'Code',
          required: true,
          maxLength: 100,
        },
        {
          name: 'name',
                    label: 'Name',
          required: true,
          maxLength: 100,
        },
        {
          name: 'unitGroupId',
          label: 'Unit Group',
          required: true,
          type: 'select',
          optionsUrl: '/UnitGroup/all',
          optionLabel: 'code',
          optionValue: 'id',
        },
        {
          name: 'default',
                    label: 'Default',
          required: true,
          maxLength: 100,
          type: 'checkbox',
        },
        {
          name: 'factor',
                    label: 'Factor',
          required: true,
          maxLength: 100,
        }
      ]}
      validationSchema={Yup.object({
        code:
                    Yup.string()
              .required('Code gereklidir.')
              .max(100, 'Code en fazla 100 karakter olmalı.')
,
        name:
                    Yup.string()
              .required('Name gereklidir.')
              .max(100, 'Name en fazla 100 karakter olmalı.')
,
        unitGroupId:
            Yup.string()
              .required('Unit Group gereklidir.')
,
        default:
                    Yup.boolean()
,
        factor:
                    Yup.string()
              .required('Factor gereklidir.')
              .max(100, 'Factor en fazla 100 karakter olmalı.')

      })}
      successMessage="Unit başarıyla kaydedildi."
      errorMessage="Kayıt sırasında bir hata oluştu."
    />
  );
}
