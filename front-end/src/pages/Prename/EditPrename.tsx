import React from 'react';
import { useUpdatePrename } from '../../services/usePrenameData';
import PrenameForm from './PrenameForm';
import { toast } from 'react-toastify';

interface PrenameFormData {
  id: number;
  prename_tha: string;
  prename_eng: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
}

interface EditPrenameProps {
  initialData: PrenameFormData;
  onSuccess?: () => void;
}

const EditPrename = ({ initialData, onSuccess }: EditPrenameProps) => {
  const { mutate, isPending } = useUpdatePrename();

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
    />
  );
};

export default EditPrename;
