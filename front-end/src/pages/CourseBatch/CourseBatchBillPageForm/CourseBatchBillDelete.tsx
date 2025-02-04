import React from 'react';
import { SelectedStudentBillInfo } from '../../../types/bill_info';
import { useDeleteBillData } from '../../../hooks/api/useBillData';
import { ErrorResponse } from '../../../types/error_response';

const CourseBatchBillDelete = ({
  studentBillInfo,
  onSuccess,
  onError,
  onClose,
}: {
  studentBillInfo: SelectedStudentBillInfo;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}) => {
  const { mutate: deleteBillData, isPending: isDeleting } = useDeleteBillData();

  const handleDeleteBillData = () => {
    deleteBillData(studentBillInfo, {
      onSuccess: () => {
        console.log('Delete bill data success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.log('Delete bill data error', error);
        onError(error);
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบใบเสร็จ Vol.{studentBillInfo.bill_infos_vol} / No.
        {studentBillInfo.bill_infos_no} ของนักเรียน "
        {studentBillInfo.firstname_tha} {studentBillInfo.lastname_tha}"
        ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน:
        การลบใบเสร็จของนักเรียนนี้จะทำให้ข้อมูลที่เกี่ยวข้องกับใบเสร็จนี้หายไป!
        (การชำระรุ่นหลักสูตรที่หมายเลข vol, no นี้จะหายไป)
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteBillData}
          disabled={isDeleting}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeleting ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default CourseBatchBillDelete;
