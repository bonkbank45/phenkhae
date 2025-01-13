import React from 'react';
import { useUpdateCourse } from '../../../hooks/api/useCourseData';
import { useCourseCategoryData } from '../../../hooks/api/useCourseCategoryData';
import { useCourseBillCategoryData } from '../../../hooks/api/useCourseBillCategoryData';
import CourseForm from './CourseForm';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseFormSchema } from '../../../schema/courses/courseForm';
import { CourseCategory } from '../../../types/course_categories';
import { CourseCategoryBill } from '../../../types/course_bill_categories';
import { ErrorResponse } from '../../../types/error_response';

interface CourseFormData {
  id: number;
  course_name: string;
  course_description: string;
  course_category_id: number;
  course_category_bill_id: number;
}

interface EditCourseProps {
  initialData: CourseFormData;
  onSuccess?: () => void;
}

const EditCourse = ({ initialData, onSuccess }: EditCourseProps) => {
  const { mutate, isPending } = useUpdateCourse();
  const { data: courseCategories } = useCourseCategoryData();
  const { data: courseBillCategories } = useCourseBillCategoryData();

  const formOptions = {
    courseCategories: courseCategories?.data.map(
      (category: CourseCategory) => ({
        value: category.id,
        label: category.category_name,
      }),
    ),
    courseBillCategories: courseBillCategories?.data.map(
      (category: CourseCategoryBill) => ({
        value: category.id,
        label: category.category_bill_name,
      }),
    ),
    resolver: yupResolver(courseFormSchema),
  };

  const handleSubmit = (data: Omit<CourseFormData, 'id'>) => {
    mutate(
      { ...data, id: initialData.id },
      {
        onSuccess: () => {
          toast.success('แก้ไขคำนำหน้าชื่อสำเร็จ');
          onSuccess?.();
        },
        onError: (error: ErrorResponse) => {
          toast.error(
            Object.entries(error.response.data.errors)
              .map(([key, value]) => `${key}: ${value.join(', ')}`)
              .join(', ') || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
          );
        },
      },
    );
  };

  return (
    <CourseForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isPending}
      formOptions={formOptions}
    />
  );
};

export default EditCourse;
