import React from 'react';
import { useUpdatePrename } from '../../hooks/api/usePrenameData';
import PrenameForm from './PrenameForm';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { addPrenameSchema } from '../../schema/addPrename/addPrename';

interface PrenameFormData {
  id: number;
  prename_tha: string;
  prename_eng: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
  show_status: number;
}

interface EditPrenameProps {
  initialData: PrenameFormData;
  onSuccess?: () => void;
}

const EditPrename = ({ initialData, onSuccess }: EditPrenameProps) => {
  const { mutate, isPending } = useUpdatePrename();

  const formOptions = {
    resolver: yupResolver(addPrenameSchema),
    defaultValues: initialData,
  };

  const handleSubmit = (data: Omit<PrenameFormData, 'id'>) => {
    mutate(
      { ...data, id: initialData.id },
      {
        onSuccess: () => {
          toast.success('แก้ไขคำนำหน้าชื่อสำเร็จ');
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message || 'เกิดข้อผิดพลาดในการแก้ไข');
        },
      },
    );
  };

  return (
    <PrenameForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isPending}
      formOptions={formOptions}
    />
  );
};

export default EditPrename;
