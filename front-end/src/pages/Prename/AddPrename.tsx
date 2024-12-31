import { useAddPrename } from '../../hooks/api/usePrenameData';
import PrenameForm from './PrenameForm';
import { toast } from 'react-toastify';

interface ErrorResponse {
  code: string;
  config: any;
  message: string;
  name: string;
  request: any;
  response: {
    data: {
      message: string;
    };
  };
  status: number;
}

interface PrenameFormData {
  id: number;
  prename_tha: string;
  prename_eng: string;
  prename_short_tha: string;
  prename_short_eng: string;
  show_status: number;
}

const AddPrename = () => {
  const { mutate, isPending, isError, error } = useAddPrename();

  const handleSubmit = (data: PrenameFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('เพิ่มคำนำหน้าชื่อสำเร็จ');
      },
      onError: (error: ErrorResponse) => {
        console.log('Error', error);
        if (
          error.response?.data?.message?.includes('Duplicate entry') ||
          error.response?.data?.message?.includes(
            'Integrity constraint violation',
          )
        ) {
          toast.error('ไม่สามารถเพิ่มข้อมูลได้ เนื่องจากไอดีรหัสซ้ำในระบบ');
        } else {
          toast.error(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
      },
    });
  };

  return <PrenameForm onSubmit={handleSubmit} isLoading={isPending} />;
};

export default AddPrename;
