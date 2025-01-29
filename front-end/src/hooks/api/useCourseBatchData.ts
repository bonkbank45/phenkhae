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

interface EditCourseBatchData extends Omit<AddCourseBatchData, 'course_id'> {
  id: number;
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

export const useAllCourseBatchDataByCourseId = (courseId: number) => {
  return useQuery({
    queryKey: ['course_batch_data_by_course_id', courseId],
    queryFn: async () => {
      try {
        const response = await api.get(`/course_group/course/${courseId}`);
        if (response.data.status === 'error') {
          throw new Error(response.data.message);
        }
        return response.data;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
};

export const useAllCourseBatchDataByCourseIds = (courseIds: number[]) => {
  return useQuery({
    queryKey: ['course_batch_data_by_course_ids', courseIds],
    queryFn: async () => {
      const response = await api.get(
        `/course_group/courses?course_ids=${courseIds.join(',')}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: courseIds.length > 0,
    placeholderData: (prevData) => prevData,
  });
};

export const useAvailableCourseBatchData = () => {
  return useQuery({
    queryKey: ['available_course_batch_data'],
    queryFn: async () => {
      const response = await api.get('/course_group/available');
      if (response.data.status === 'error') {
        throw new Error(response.data.message);
      }
      return response.data;
    },
  });
};

export const useAddCourseBatchData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddCourseBatchData) => {
      console.log(data);
      const response = await api.post('/course_group', data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['course_batch_data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['available_course_batch_data'],
      });
      console.log('Success', response.data);
    },
    onError: (error: Error) => {
      console.error('Failed to add course batch:', error.message);
    },
  });
};

export const useEditCourseBatchData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EditCourseBatchData) => {
      console.log(data);
      const response = await api.put(`/course_group/${data.id}`, data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['course_batch_data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['available_course_batch_data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['course_batch_data_by_course_id'],
      });
      console.log('Success', response.data);
    },
    onError: (error: Error) => {
      console.error('Failed to edit course batch:', error.message);
    },
  });
};

export const useDeleteCourseBatchData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/course_group/${id}`);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['course_batch_data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['available_course_batch_data'],
      });
      console.log('Success', response.data);
    },
    onError: (error: Error) => {
      console.error('Failed to delete course batch:', error.message);
    },
  });
};
