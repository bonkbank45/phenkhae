import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';
import { CourseCompletion } from '../../types/course_completion';

export const useCourseCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      course_group_id: number;
      student_id: number;
      completion_date: string;
    }) => api.post('/course_completion', data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['course_completion_table'],
        exact: false,
      });
      console.log(data);
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useCourseCompletionTable = (
  page: number,
  availableLicense: string,
  courseFilter: string,
  batchFilter: string,
  searchTerm: string,
  dateSearchStart: string,
  dateSearchEnd: string,
  shouldFetch: boolean,
) => {
  return useQuery({
    queryKey: [
      'course_completion_table',
      page,
      availableLicense,
      courseFilter,
      batchFilter,
      searchTerm,
      dateSearchStart,
      dateSearchEnd,
      shouldFetch,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(availableLicense && { available_license: availableLicense }),
        ...(courseFilter && { course_filter: courseFilter }),
        ...(batchFilter && { batch_filter: batchFilter }),
        ...(searchTerm && { search_term: searchTerm }),
        ...(dateSearchStart && { date_search_start: dateSearchStart }),
        ...(dateSearchEnd && { date_search_end: dateSearchEnd }),
      });
      const response = await api.get(`/course_completion/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: shouldFetch,
    placeholderData: (prevData) => prevData,
  });
};

export const useUnqualifiedCompletions = (
  page: number,
  availableLicense: string,
  courseFilter: string,
  batchFilter: string,
  searchTerm: string,
) => {
  return useQuery({
    queryKey: [
      'unqualified_completions',
      page,
      availableLicense,
      courseFilter,
      batchFilter,
      searchTerm,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(availableLicense && { available_license: availableLicense }),
        ...(courseFilter && { course_filter: courseFilter }),
        ...(batchFilter && { batch_filter: batchFilter }),
        ...(searchTerm && { search_term: searchTerm }),
      });
      const response = await api.get(
        `/course_completion/unqualified/table?${params}`,
      );
      return response.data;
    },
    placeholderData: (prevData) => prevData,
  });
};

export const useUpdateCourseCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseCompletion) => {
      console.log(data);
      return api.put(`/course_completion/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course_completion_table'],
        exact: false,
      });
      console.log('Update course completion completed');
    },
    onError: (error: ErrorResponse) => {
      console.error(error || 'Failed to update course completion');
    },
  });
};

export const useDeleteCourseCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseCompletionId: string) =>
      api.delete(`/course_completion/${courseCompletionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course_completion_table'],
        exact: false,
      });
      console.log('ลบข้อมูลการจบหลักสูตรสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.error(error.message || 'เกิดข้อผิดพลาดในการลบ');
    },
  });
};
