import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '../../types/error_response';
import api from '../../services/api';
import { format } from 'date-fns';

export interface UpdateLicenseCompleteStudentProps {
  id: number;
  student_id: number;
  course_group_id: number;
  date_complete: string;
}

export const useLicenseComplete = (
  page: number,
  courseId: string,
  searchTerm: string,
  dateSearchStart: Date | null,
  dateSearchEnd: Date | null,
) => {
  return useQuery({
    queryKey: [
      'license_complete_table',
      page,
      courseId,
      searchTerm,
      dateSearchStart,
      dateSearchEnd,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(courseId && { course_id: courseId.toString() }),
        ...(searchTerm && { search: searchTerm }),
        ...(dateSearchStart && {
          date_search_start: format(dateSearchStart, 'yyyy-MM-dd'),
        }),
        ...(dateSearchEnd && {
          date_search_end: format(dateSearchEnd, 'yyyy-MM-dd'),
        }),
      });
      const response = await api.get(
        `/student_license_complete/table?${params}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
};

export const useAddLicenseComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/student_license_complete', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['license_complete_table'],
        exact: false,
      });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useUpdateLicenseComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateLicenseCompleteStudentProps) => {
      const response = await api.put(
        `/student_license_complete/${data.id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      console.log('success');
      queryClient.invalidateQueries({
        queryKey: ['license_complete_table'],
        exact: false,
      });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useDeleteLicenseComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number }) => {
      const response = await api.delete(`/student_license_complete/${data.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['license_complete_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_unlicensed_table'],
        exact: false,
      });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useAddBulkLicenseComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/student_license_complete/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['license_complete_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_unlicensed_table'],
        exact: false,
      });
    },
  });
};

export const useGetCourseLicenseCompletedPerYear = () => {
  return useQuery({
    queryKey: ['course_license_completed_per_year'],
    queryFn: async () => {
      const response = await api.get(
        '/student_license_complete/course_license_completed_per_year/statistic',
      );
      return response.data;
    },
  });
};
