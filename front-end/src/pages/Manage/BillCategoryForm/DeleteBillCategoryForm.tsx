import React from 'react';
import { useDeleteBillCategory } from '../../../hooks/api/basicData/useBillCategoryData';
import { ErrorResponse } from '../../../types/error_response';

interface BillCategory {
  id: number;
  category_bill_name: string;
}

interface DeleteBillCategoryProps {
  selectedBillCategory: BillCategory;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteBillCategoryForm = ({
  selectedBillCategory,
  onSuccess,
  onError,
  onClose,
}: DeleteBillCategoryProps) => {
  const { mutate: deleteCategory, isPending: isDeletingCategory } =
    useDeleteBillCategory();

  const handleDeleteBillCategory = () => {
    deleteCategory(Number(selectedBillCategory.id), {
      onSuccess: () => {
        console.log('Delete bill category success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.error('Delete bill category error', error);
        onError(error);
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลหมวดหมู่ใบเสร็จ "
        {selectedBillCategory.category_bill_name}" ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลหมวดหมู่ใบเสร็จจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteBillCategory}
          disabled={isDeletingCategory}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingCategory ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteBillCategoryForm;
