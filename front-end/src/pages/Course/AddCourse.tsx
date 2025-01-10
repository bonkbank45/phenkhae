import { useAddCourse } from '../../hooks/api/useCourseData';
import { useCourseCategoryData } from '../../hooks/api/useCourseCategoryData';
import { useCourseBillCategoryData } from '../../hooks/api/useCourseBillCategoryData';
import { toast } from 'react-toastify';
import { Course } from '../../types/course';
import { ErrorResponse } from '../../types/error_response';
import CourseForm from './CourseForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseFormSchema } from '../../schema/courses/courseForm';

const AddCourse = () => {
  const { mutate: addCourse, isPending, isError, error } = useAddCourse();
  const { data: courseCategories, isLoading: isCourseCategoriesLoading } =
    useCourseCategoryData();
  const {
    data: courseBillCategories,
    isLoading: isCourseBillCategoriesLoading,
  } = useCourseBillCategoryData();

  const formOptions = {
    courseCategories:
      courseCategories?.data.map((category) => ({
        value: category.id,
        label: category.category_name,
      })) || [],
    courseBillCategories:
      courseBillCategories?.data.map((category) => ({
        value: category.id,
        label: category.category_bill_name,
      })) || [],
    resolver: yupResolver(courseFormSchema),
  };

  const handleSubmit = (data: Course) => {
    addCourse(data, {
      onSuccess: () => {
        toast.success('เพิ่มหลักสูตรสำเร็จ');
      },
      onError: (error: ErrorResponse) => {
        console.log('Error', error);
        if (
          error.response.data.message.includes('Duplicate entry') ||
          error.response.data.message.includes('Integrity constraint violation')
        ) {
          toast.error('ไม่สามารถเพิ่มข้อมูลได้ เนื่องจากไอดีรหัสซ้ำในระบบ');
        } else {
          toast.error(
            Object.entries(error.response.data.errors)
              .map(([key, value]) => `${key}: ${value.join(', ')}`)
              .join(', ') || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
          );
        }
      },
    });
  };

  return (
    <CourseForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      formOptions={formOptions}
    />
  );
};

export default AddCourse;
