import React from 'react';
import { CourseGroup } from '../../types/course_group';
import { ErrorResponse } from '../../types/error_response';
import { useRemoveEnrollment } from '../../hooks/api/useEnrollmentData';

interface SelectedStudent {
  id: number;
  firstname_tha: string;
  lastname_tha: string;
}

interface RemoveCourseBatchStudentFormProps {
  courseBatch: CourseGroup;
  selectedStudents: SelectedStudent[];
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}

const RemoveCourseBatchStudentForm = ({
  courseBatch,
  selectedStudents,
  onSuccess,
  onError,
}: RemoveCourseBatchStudentFormProps) => {
  const { mutate: removeEnrollment, isPending: isDeleting } =
    useRemoveEnrollment();
  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบนักเรียนออกจากรุ่นหลักสูตร "{courseBatch.course.course_name}{' '}
        รุ่นที่ {courseBatch.batch}" ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน:
        การลบนักเรียนออกจากรุ่นหลักสูตรนี้จะทำให้ข้อมูลที่เกี่ยวข้องของนักเรียนกับหลักสูตรหายไป!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onSuccess}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={() => {
            removeEnrollment(
              {
                courseGroupId: courseBatch.id,
                studentIds: selectedStudents.map((student) => student.id),
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

export default RemoveCourseBatchStudentForm;
