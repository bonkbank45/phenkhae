import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';

export const useExamInvidual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/exam_invidual', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exam'],
        exact: false,
      });
      console.log('Add exam invidual success');
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useExamInvidualUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/exam_invidual/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exam'],
        exact: false,
      });
      console.log('Update exam invidual success');
    },
  });
};

export const useExamInvidualDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (examId: number) => {
      const response = await api.delete(`/exam_invidual/${examId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exam'],
        exact: false,
      });
      console.log('Delete exam invidual success');
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};
