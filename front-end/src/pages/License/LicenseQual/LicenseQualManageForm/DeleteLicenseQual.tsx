import React from 'react';
import { useDeleteLicenseQual } from '../../../../hooks/api/useLicenseQual';
import { ErrorResponse } from '../../../../types/error_response';
import { format } from 'date-fns';

export interface DeleteLicenseQualStudentProps {
  id: number;
  student_id: number;
  course_group_id: number;
  firstname_tha: string;
  lastname_tha: string;
  date_qualified: string;
}

const DeleteLicenseQual = ({
  selectedLicenseQualStudent,
  onSuccess,
  onError,
  onClose,
}: {
  selectedLicenseQualStudent: DeleteLicenseQualStudentProps;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}) => {
  const { mutate: deleteLicenseQual, isPending: isDeletingLicenseQual } =
    useDeleteLicenseQual();

  const handleDeleteLicenseQual = () => {
    deleteLicenseQual(selectedLicenseQualStudent.id, {
      onSuccess: () => {
        console.log('Delete license qualification success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.error('Delete license qualification error', error);
        onError(error);
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลผู้มีสิทธิการสอบใบประกอบวิชาชีพของนักเรียน "
        {selectedLicenseQualStudent.firstname_tha}{' '}
        {selectedLicenseQualStudent.lastname_tha}"
        ที่มีสิทธิการสอบใบประกอบวิชาชีพเมื่อวันที่ '
        {format(
          new Date(selectedLicenseQualStudent.date_qualified),
          'dd/MM/yyyy',
        )}
        ' ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลผู้มีสิทธิการสอบใบประกอบวิชาชีพจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteLicenseQual}
          disabled={isDeletingLicenseQual}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingLicenseQual ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteLicenseQual;
