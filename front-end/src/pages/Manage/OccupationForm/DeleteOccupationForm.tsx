import React from 'react';
import { useDeleteOccupation } from '../../../hooks/api/basicData/useOccupationData';
import { ErrorResponse } from '../../../types/error_response';

interface Occupation {
  id: number;
  occupation_name: string;
}

interface DeleteOccupationProps {
  selectedOccupation: Occupation;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteOccupationForm = ({
  selectedOccupation,
  onSuccess,
  onError,
  onClose,
}: DeleteOccupationProps) => {
  const { mutate: deleteOccupation, isPending: isDeletingOccupation } =
    useDeleteOccupation();

  const handleDeleteOccupation = () => {
    deleteOccupation(
      { id: selectedOccupation.id },
      {
        onSuccess: () => {
          console.log('Delete occupation success');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.error('Delete occupation error', error);
          onError(error);
        },
      },
    );
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลอาชีพ "{selectedOccupation.occupation_name}"
        ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลอาชีพจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteOccupation}
          disabled={isDeletingOccupation}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingOccupation ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteOccupationForm;
