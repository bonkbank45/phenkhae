import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { ErrorResponse } from '../../../types/error_response';

interface CourseCategory {
  id?: number;
  category_name: string;
}

export const useCourseCategoryDataTable = (search: string, page: number) => {
  return useQuery({
    queryKey: ['course_category_data', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(search && { search: search }),
        ...(page && { page: page.toString() }),
      });
      const response = await api.get(`/course_category/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useAddCourseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CourseCategory) => {
      const response = await api.post('/course_category', data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Add Course Category Success');
      queryClient.invalidateQueries({ queryKey: ['course_category_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useUpdateCourseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CourseCategory) => {
      const response = await api.put(`/course_category/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Update Course Category Success');
      queryClient.invalidateQueries({ queryKey: ['course_category_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useDeleteCourseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/course_category/${id}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Delete Course Category Success');
      queryClient.invalidateQueries({ queryKey: ['course_category_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};
