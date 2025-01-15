import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaginatedCourseGroup } from '../../types/course_group';
import api from '../../services/api';

interface AddCourseBatchData {
  course_id: string;
  batch: number;
  max_students: number;
  date_start: string;
  date_end: string;
}

interface UseCourseBatchDataTableParams {
  page: number;
  searchTerm: string;
  courseBatchStatus: string;
  courseId: string;
}

export const useCourseBatchDataTable = ({
  page,
  searchTerm,
  courseBatchStatus,
  courseId,
}: UseCourseBatchDataTableParams) => {
  return useQuery<PaginatedCourseGroup>({
    queryKey: [
      'course_batch_data',
      page,
      searchTerm,
      courseBatchStatus,
      courseId,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(courseBatchStatus && { status: courseBatchStatus }),
        ...(courseId && { course_id: courseId }),
      });
      try {
        const response = await api.get(`/course_group/table?${params}`);
        if (response.data.status === 'error') {
          throw new Error(response.data.message);
        }
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
};

export const useCourseBatchDataById = (id: string) => {
  return useQuery({
    queryKey: ['course_batch_data', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/course_group/${id}`);
        if (response.data.status === 'error') {
          throw new Error(response.data.message);
        }
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useAddCourseBatchData = (data: AddCourseBatchData) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddCourseBatchData) => {
      const response = await api.post('/course_group', data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['course_batch_data'],
      });
      console.log('Success', response.data);
    },
    onError: (error: Error) => {
      console.error('Failed to add course batch:', error.message);
    },
  });
};
