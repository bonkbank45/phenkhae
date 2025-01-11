import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';

interface AddCourseBatchData {
  course_id: string;
  batch: number;
  max_students: number;
  date_start: string;
  date_end: string;
}

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
