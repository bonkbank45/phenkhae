import { useQuery } from '@tanstack/react-query';
import api from './axios/axiosClient';

export const useCourseData = () => {
  const { data: courseGroupEnrollmentData, isLoading } = useQuery({
    queryKey: ['course_group_enrollment_data'],
    queryFn: () =>
      api.get('course_group/available').then(
        (res: {
          data: {
            status: string;
            message: string;
            data: {
              [courseCategoryName: string]: {
                course_name: string;
                course_batch: number;
                max_students: number;
                students_enrolled: number;
              }[];
            };
          };
        }) => res.data,
      ),
  });
  // const { data: courseCategories, isLoading: isCourseCategoriesLoading } =
  //   useQuery({
  //     queryKey: ['course_categories'],
  //     queryFn: () =>
  //       axios.get('/api/course_category').then((res) => {
  //         return res.data.data.map(
  //           (courseCategory: { id: number; category_name: string }) => ({
  //             id: courseCategory.id,
  //             category_name: courseCategory.category_name,
  //           }),
  //         );
  //       }),
  //     staleTime: 1000 * 60 * 60 * 24,
  //     gcTime: 1000 * 60 * 60 * 24,
  //   });

  // const { data: courses, isLoading: isCoursesLoading } = useQuery({
  //   queryKey: ['courses'],
  //   queryFn: () =>
  //     axios.get('/api/course').then((res) => {
  //       return res.data.data.map(
  //         (course: {
  //           id: number;
  //           course_category_id: number;
  //           course_category_bill_id: number;
  //           course_name: string;
  //           course_description: string;
  //         }) => ({
  //           id: course.id,
  //           course_category_id: course.course_category_id,
  //           course_category_bill_id: course.course_category_bill_id,
  //           course_name: course.course_name,
  //           course_description: course.course_description,
  //         }),
  //       );
  //     }),
  //   staleTime: 1000 * 60 * 60 * 24,
  //   gcTime: 1000 * 60 * 60 * 24,
  // });
  // const isLoading = isCourseCategoriesLoading || isCoursesLoading;

  return { courseGroupEnrollmentData, isLoading };
};
