import React from 'react';
import { useAddPrename } from '../../services/usePrenameData';
import PrenameForm from './PrenameForm';
import { toast } from 'react-toastify';

interface PrenameFormData {
  prename_tha: string;
  prename_eng: string;
  prename_short_tha: string;
  prename_short_eng: string;
}

const AddPrename = () => {
  const { mutate, isPending, isError, error } = useAddPrename();

  const handleSubmit = (data: PrenameFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('เพิ่มคำนำหน้าชื่อสำเร็จ');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div>
      <PrenameForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
};

export default AddPrename;
