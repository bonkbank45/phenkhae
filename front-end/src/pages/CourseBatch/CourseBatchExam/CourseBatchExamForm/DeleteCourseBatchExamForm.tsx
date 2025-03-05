import React from 'react';
import { useDeleteExam } from '../../../../hooks/api/useExamData';
import { ExamTable } from '../../../../types/exam';
import { ErrorResponse } from '../../../../types/error_response';
import { format } from 'date-fns';

const DeleteCourseBatchExamForm = ({
  exam,
  onSuccess,
  onError,
  onClose,
}: {
  exam: ExamTable;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}) => {
  const { mutate: deleteExam, isPending: isDeletingExam } = useDeleteExam(
    exam.id,
  );

  const handleDeleteExam = () => {
    deleteExam(undefined, {
      onSuccess: () => {
        console.log('Delete exam success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.error('Delete exam error', error);
        onError(error);
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลการสอบของ "{exam.course_group.course.course_name}"
        รุ่นที่ {exam.course_group.batch} ประเภท "
        {exam.exam_type.exam_type_name}" ปี {exam.year} เทอม {exam.term}{' '}
        วันที่สอบ '{format(new Date(exam.date_start_exam), 'dd/MM/yyyy')}'
        ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลการสอบจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteExam}
          disabled={isDeletingExam}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingExam ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteCourseBatchExamForm;
