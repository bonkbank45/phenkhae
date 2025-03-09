import React from 'react';
import { useDeleteMaritalData } from '../../../hooks/api/basicData/useMaritalData';
import { ErrorResponse } from '../../../types/error_response';

interface MaritalStatus {
  id: number;
  marital_name: string;
}

interface DeleteMaritalStatusProps {
  selectedMaritalStatus: MaritalStatus;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteMaritalStatusForm = ({
  selectedMaritalStatus,
  onSuccess,
  onError,
  onClose,
}: DeleteMaritalStatusProps) => {
  const { mutate: deleteMaritalStatus, isPending: isDeletingMaritalStatus } =
    useDeleteMaritalData();

  const handleDeleteMaritalStatus = () => {
    deleteMaritalStatus(
      { id: selectedMaritalStatus.id },
      {
        onSuccess: () => {
          console.log('Delete marital status success');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.error('Delete marital status error', error);
          onError(error);
        },
      },
    );
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลสถานภาพ "{selectedMaritalStatus.marital_name}"
        ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลสถานภาพสมรสจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteMaritalStatus}
          disabled={isDeletingMaritalStatus}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingMaritalStatus ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteMaritalStatusForm;
