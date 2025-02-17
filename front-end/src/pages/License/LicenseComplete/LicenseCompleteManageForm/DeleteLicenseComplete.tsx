import React from 'react';
import { useDeleteLicenseComplete } from '../../../../hooks/api/useLicenseComplete';
import { ErrorResponse } from '../../../../types/error_response';
import { format } from 'date-fns';

export interface DeleteLicenseCompleteStudentProps {
  id: number;
  student_id: number;
  course_id: number;
  firstname_tha: string;
  lastname_tha: string;
  date_complete: string;
}

const DeleteLicenseComplete = ({
  selectedLicenseCompleteStudent,
  onSuccess,
  onError,
  onClose,
}: {
  selectedLicenseCompleteStudent: DeleteLicenseCompleteStudentProps;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}) => {
  const {
    mutate: deleteLicenseComplete,
    isPending: isDeletingLicenseComplete,
  } = useDeleteLicenseComplete();

  const handleDeleteLicenseComplete = () => {
    deleteLicenseComplete(
      { id: selectedLicenseCompleteStudent.id },
      {
        onSuccess: () => {
          console.log('Delete license completion success');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.error('Delete license completion error', error);
          onError(error);
        },
      },
    );
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลผู้สอบผ่านใบประกอบวิชาชีพของนักเรียน "
        {selectedLicenseCompleteStudent.firstname_tha}{' '}
        {selectedLicenseCompleteStudent.lastname_tha}"
        ที่สอบผ่านใบประกอบวิชาชีพเมื่อวันที่ '
        {format(
          new Date(selectedLicenseCompleteStudent.date_complete),
          'dd/MM/yyyy',
        )}
        ' ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลผู้สอบผ่านใบประกอบวิชาชีพจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteLicenseComplete}
          disabled={isDeletingLicenseComplete}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingLicenseComplete ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteLicenseComplete;
