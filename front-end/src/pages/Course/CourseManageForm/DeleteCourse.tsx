import { useDeleteCourse } from '../../../hooks/api/useCourseData';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../types/error_response';

interface DeleteCourseProps {
  id: number;
  courseName: string;
  onSuccess?: () => void;
}

const DeleteCourse = ({ id, courseName, onSuccess }: DeleteCourseProps) => {
  const { mutate, isPending } = useDeleteCourse();

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success('ลบหลักสูตรสำเร็จ');
        onSuccess?.();
      },
      onError: (error: ErrorResponse) => {
        toast.error(
          Object.entries(error.response.data.errors)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join(', ') || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        );
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบหลักสูตร "{courseName}" ใช่หรือไม่?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onSuccess}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isPending ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteCourse;
