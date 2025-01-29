import React from 'react';
import { BasicStudentInfo } from '../../types/student';
import { ErrorResponse } from '../../types/error_response';
import { useDeleteStudentData } from '../../hooks/api/useStudentData';

interface DeleteStudentFormProps {
  student: BasicStudentInfo;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteStudentForm = ({
  student,
  onSuccess,
  onError,
  onClose,
}: DeleteStudentFormProps) => {
  const { mutate: deleteStudent, isPending: isDeleting } =
    useDeleteStudentData();
  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบรายชื่อนักเรียน "{student.firstname_tha}{' '}
        {student.lastname_tha}" ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบนักเรียนนี้จะทำให้ข้อมูลที่เกี่ยวข้องกับนักเรียนนี้หายไป!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            onClose?.();
          }}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={() => {
            deleteStudent(student.id, {
              onSuccess: () => {
                onSuccess?.();
              },
              onError: (error: ErrorResponse) => {
                onError?.(error);
              },
            });
          }}
          disabled={isDeleting}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeleting ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteStudentForm;
