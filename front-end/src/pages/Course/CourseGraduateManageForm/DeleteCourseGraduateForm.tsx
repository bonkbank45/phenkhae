import React from 'react';
import { CourseCompletion } from '../../../types/course_completion';
import { ErrorResponse } from '../../../types/error_response';
import { useDeleteCourseCompletion } from '../../../hooks/api/useCourseCompletion';

interface DeleteCourseGraduateFormProps {
  courseCompletion: CourseCompletion;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteCourseGraduateForm = ({
  courseCompletion,
  onSuccess,
  onError,
  onClose,
}: DeleteCourseGraduateFormProps) => {
  const { mutate: deleteCourseCompletion, isPending: isDeleting } =
    useDeleteCourseCompletion();

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลการจบหลักสูตรของนักเรียน "
        {courseCompletion.student.firstname_tha}{' '}
        {courseCompletion.student.lastname_tha}" ในหลักสูตร "
        {courseCompletion.course_group.course.course_name}" ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลนี้จะทำให้ประวัติการจบหลักสูตรของนักเรียนหายไป!
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
            deleteCourseCompletion(courseCompletion.id.toString(), {
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

export default DeleteCourseGraduateForm;
