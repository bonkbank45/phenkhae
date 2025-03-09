import React from 'react';
import { useDeleteCourseCategory } from '../../../hooks/api/basicData/useCourseCategoryData';
import { ErrorResponse } from '../../../types/error_response';

interface CourseCategory {
  id: number;
  category_name: string;
}

interface DeleteCourseCategoryProps {
  selectedCourseCategory: CourseCategory;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteCourseCategoryForm = ({
  selectedCourseCategory,
  onSuccess,
  onError,
  onClose,
}: DeleteCourseCategoryProps) => {
  const { mutate: deleteCategory, isPending: isDeletingCategory } =
    useDeleteCourseCategory();

  const handleDeleteCourseCategory = () => {
    deleteCategory(Number(selectedCourseCategory.id), {
      onSuccess: () => {
        console.log('Delete course category success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.error('Delete course category error', error);
        onError(error);
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลหมวดหมู่หลักสูตร "
        {selectedCourseCategory.category_name}" ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลหมวดหมู่หลักสูตรจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteCourseCategory}
          disabled={isDeletingCategory}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingCategory ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteCourseCategoryForm;
