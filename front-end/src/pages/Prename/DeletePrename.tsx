import { useDeletePrename } from '../../hooks/api/usePrenameData';
import { toast } from 'react-toastify';

interface DeletePrenameProps {
  id: number;
  prenameThai: string;
  onSuccess?: () => void;
}

interface ApiError {
  response?: {
    data: {
      message: string;
    };
  };
}

const DeletePrename = ({ id, prenameThai, onSuccess }: DeletePrenameProps) => {
  const { mutate, isPending } = useDeletePrename();

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success('ลบคำนำหน้าชื่อสำเร็จ');
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(
          error.response.data.message ||
            'ไม่สามารถลบคำนำหน้าชื่อนี้ได้เนื่องจากมีการใช้งานอยู่',
        );
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4">
        คุณต้องการลบคำนำหน้าชื่อ "{prenameThai}" ใช่หรือไม่?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onSuccess}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300"
        >
          {isPending ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeletePrename;
