import React from 'react';
import { useDeleteExamType } from '../../../hooks/api/basicData/useExamTypeData';
import { ErrorResponse } from '../../../types/error_response';

interface ExamType {
  id: number;
  exam_type_name: string;
}

interface DeleteExamTypeProps {
  selectedExamType: ExamType;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteExamTypeForm = ({
  selectedExamType,
  onSuccess,
  onError,
  onClose,
}: DeleteExamTypeProps) => {
  const { mutate: deleteExamType, isPending: isDeletingExamType } =
    useDeleteExamType();

  const handleDeleteExamType = () => {
    deleteExamType(
      { id: selectedExamType.id },
      {
        onSuccess: () => {
          console.log('Delete exam type success');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.error('Delete exam type error', error);
          onError(error);
        },
      },
    );
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลประเภทการสอบ "{selectedExamType.exam_type_name}"
        ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลประเภทการสอบจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteExamType}
          disabled={isDeletingExamType}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingExamType ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteExamTypeForm;
