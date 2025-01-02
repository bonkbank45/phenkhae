import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { ApiResponse } from '../../types/course_bill_categories';

export const useCourseBillCategoryData = () => {
  return useQuery<ApiResponse>({
    queryKey: ['course-category-bills'],
    queryFn: async () => {
      const response = await api.get<ApiResponse>('/course_category_bill');
      return response.data;
    },
  });
};
