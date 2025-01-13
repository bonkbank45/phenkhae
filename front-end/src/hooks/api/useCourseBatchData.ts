import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../services/api';

interface AddCourseBatchData {
  course_id: string;
  batch: number;
  max_students: number;
  date_start: string;
  date_end: string;
}

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
  return useMutation({
    mutationFn: async (data: AddCourseBatchData) => {
      const response = await api.post('/course_group', data);
      return response.data;
    },
    onSuccess: (response) => {
      console.log('Success', response.data);
    },
    onError: (error: Error) => {
      console.error('Failed to add course batch:', error.message);
    },
  });
};
