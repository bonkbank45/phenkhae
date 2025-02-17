import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';

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
) => {
  return useQuery({
    queryKey: [
      'course_completion_table',
      page,
      availableLicense,
      courseFilter,
      batchFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(availableLicense && { available_license: availableLicense }),
        ...(courseFilter && { course_filter: courseFilter }),
        ...(batchFilter && { batch_filter: batchFilter }),
      });
      const response = await api.get(`/course_completion/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
};

export const useUnqualifiedCompletions = (
  page: number,
  availableLicense: string,
  courseFilter: string,
  batchFilter: string,
) => {
  return useQuery({
    queryKey: [
      'unqualified_completions',
      page,
      availableLicense,
      courseFilter,
      batchFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(availableLicense && { available_license: availableLicense }),
        ...(courseFilter && { course_filter: courseFilter }),
        ...(batchFilter && { batch_filter: batchFilter }),
      });
      const response = await api.get(
        `/course_completion/unqualified/table?${params}`,
      );
      return response.data;
    },
    placeholderData: (prevData) => prevData,
  });
};
