import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { ApiResponse, CourseCategory } from '../../types/course_categories';

export const useCourseCategoryData = () => {
  return useQuery<ApiResponse>({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const response = await api.get<ApiResponse>('/course_category');
      return response.data;
    },
  });
};
