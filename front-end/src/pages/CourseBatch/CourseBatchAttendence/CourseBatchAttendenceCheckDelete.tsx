import React from 'react';
import { useDeleteStudentAttendence } from '../../../hooks/api/useStudentAttendence';
import { ErrorResponse } from '../../../types/error_response';

interface CourseBatchAttendenceCheckDeleteProps {
  studentAttendencesTableData: any;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const CourseBatchAttendenceCheckDelete = ({
  studentAttendencesTableData,
  onSuccess,
  onClose,
  onError,
}: CourseBatchAttendenceCheckDeleteProps) => {
  const { mutate: deleteStudentAttendence, isPending: isDeleting } =
    useDeleteStudentAttendence();

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบการเช็คชื่อของนักเรียน{' '}
        {studentAttendencesTableData.firstname_tha}{' '}
        {studentAttendencesTableData.lastname_tha}
        ใช่หรือไม่?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={() => {
            deleteStudentAttendence(
              {
                courseAttendenceId:
                  studentAttendencesTableData.course_attendence_id,
                studentId: Number(studentAttendencesTableData.student_id),
              },
              {
                onSuccess: () => {
                  onSuccess?.();
                },
                onError: (error: ErrorResponse) => {
                  onError?.(error);
                },
              },
            );
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

export default CourseBatchAttendenceCheckDelete;
