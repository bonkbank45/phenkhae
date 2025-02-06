import React from 'react';
import { useDeleteEnrollment } from '../../hooks/api/useEnrollmentData';
import { ErrorResponse } from '../../types/error_response';
import { StudentCourseDataTable } from '../../types/enrollment';

const DeleteEnrollmentForm = ({
  enrollmentInfo,
  onSuccess,
  onError,
  onClose,
}: {
  enrollmentInfo: StudentCourseDataTable;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}) => {
  const { mutate: deleteEnrollmentData, isPending: isDeleting } =
    useDeleteEnrollment();

  const handleDeleteEnrollment = () => {
    deleteEnrollmentData(
      {
        courseGroupId: Number(enrollmentInfo.course_group_id),
        studentId: Number(enrollmentInfo.student_id),
      },
      {
        onSuccess: () => {
          console.log('Delete enrollment data success');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.log('Delete enrollment data error', error);
          onError(error);
        },
      },
    );
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลการลงทะเบียน หลักสูตร "{enrollmentInfo.course_name}" "
        {enrollmentInfo.batch_name}" ของนักเรียน "{enrollmentInfo.student_name}"
        ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน:
        การลบข้อมูลการลงทะเบียนจะทำให้ข้อมูลที่เกี่ยวข้องกับลงทะเบียนของนักเรียนทั้งหมดหายไป!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteEnrollment}
          disabled={isDeleting}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeleting ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteEnrollmentForm;
