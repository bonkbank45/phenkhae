import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, Course } from '../../types/course';
import { ErrorResponse } from '../../types/error_response';
import api from '../../services/api';
interface UseCourseDataParams {
  page: number;
  searchTerm?: string;
  courseCategoryId?: string;
  courseBillCategoryId?: string;
  onLoadComplete?: () => void;
}

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
  //       }),{!!  !!}
  //     staleTime: 10{!!  !!}* 60 * 60 * 24,
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

export const useCourseDataTable = ({
  page,
  searchTerm,
  courseCategoryId,
  courseBillCategoryId,
  onLoadComplete,
}: UseCourseDataParams) => {
  return useQuery({
    queryKey: [
      'courses',
      page,
      searchTerm,
      courseCategoryId,
      courseBillCategoryId,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(courseCategoryId && { category: courseCategoryId }),
        ...(courseBillCategoryId && { bill_category: courseBillCategoryId }),
      });
      const response = await api.get<ApiResponse<Course>>(
        `/course/table?${params}`,
      );
      onLoadComplete?.();
      console.log(response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
};

export const useAddCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Course) => api.post<Course>('/course', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false });
      console.log('เพิ่มหลักสูตรสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.log('Error', error);
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Course) => api.put<Course>(`/course/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false });
      console.log('แก้ไขหลักสูตรสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.error(error.message || 'เกิดข้อผิดพลาดในการแก้ไข');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/course/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false });
      console.log('ลบหลักสูตรสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.error(error.message || 'เกิดข้อผิดพลาดในการลบ');
    },
  });
};
