import React from 'react';
import { deleteEducationQual } from '../../../hooks/api/basicData/useEducationQualData';
import { ErrorResponse } from '../../../types/error_response';

interface EducationQual {
  id: number;
  edu_qual_name: string;
  edu_qual_eng: string;
}

interface DeleteEducationQualProps {
  selectedEducationQual: EducationQual;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteEducationQualForm = ({
  selectedEducationQual,
  onSuccess,
  onError,
  onClose,
}: DeleteEducationQualProps) => {
  const { mutate: deleteQual, isPending: isDeletingQual } =
    deleteEducationQual();

  const handleDeleteEducationQual = () => {
    deleteQual(
      { id: selectedEducationQual.id },
      {
        onSuccess: () => {
          console.log('Delete education qualification success');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.error('Delete education qualification error', error);
          onError(error);
        },
      },
    );
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลวุฒิการศึกษา "{selectedEducationQual.edu_qual_name}"
        ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลวุฒิการศึกษาจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteEducationQual}
          disabled={isDeletingQual}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingQual ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteEducationQualForm;
