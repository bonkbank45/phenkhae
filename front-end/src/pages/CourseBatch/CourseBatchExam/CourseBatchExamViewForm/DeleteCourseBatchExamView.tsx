import React from 'react';
import { useExamInvidualDelete } from '../../../../hooks/api/useExamInvidual';
import { ErrorResponse } from '../../../../types/error_response';
import { format } from 'date-fns';

export interface ExamIndividualProps {
  id: number;
  student_id: number;
  exam_id: number;
  date_exam: string;
  score_get: number;
  student: {
    firstname_tha: string;
    lastname_tha: string;
  };
}

const DeleteCourseBatchExamView = ({
  selectedExamInvidual,
  onSuccess,
  onError,
  onClose,
}: {
  selectedExamInvidual: ExamIndividualProps;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}) => {
  const { mutate: deleteExamInvidual, isPending: isDeletingExam } =
    useExamInvidualDelete();

  const handleDeleteExam = () => {
    deleteExamInvidual(selectedExamInvidual.id, {
      onSuccess: () => {
        console.log('Delete exam score success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.error('Delete exam score error', error);
        onError(error);
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลคะแนนสอบของนักเรียน "
        {selectedExamInvidual.student.firstname_tha}{' '}
        {selectedExamInvidual.student.lastname_tha}" ที่สอบเมื่อวันที่ '
        {format(new Date(selectedExamInvidual.date_exam), 'dd/MM/yyyy')}'
        ที่ได้คะแนน {selectedExamInvidual.score_get} คะแนน ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลคะแนนสอบจะไม่สามารถกู้คืนได้!
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

export default DeleteCourseBatchExamView;
