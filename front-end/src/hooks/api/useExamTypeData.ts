import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';

export const useExamTypeData = () => {
  return useQuery({
    queryKey: ['exam_type'],
    queryFn: async () => {
      const response = await api.get('/exam_type');
      return response.data;
    },
  });
};

export const useAddExamType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/exam_type', data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Add exam type success');
      queryClient.invalidateQueries({ queryKey: ['exam_type'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};
