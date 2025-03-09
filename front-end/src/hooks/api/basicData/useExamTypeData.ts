import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { ErrorResponse } from '../../../types/error_response';

interface ExamType {
  id: number;
  exam_type_name: string;
}

export const useExamTypeDataTable = (search: string, page: number) => {
  return useQuery({
    queryKey: ['exam_type_data', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(search && { search: search }),
        ...(page && { page: page.toString() }),
      });
      const response = await api.get(`/exam_type/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useAddExamType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ExamType) => {
      const response = await api.post('/exam_type', data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Add Exam Type Success');
      queryClient.invalidateQueries({ queryKey: ['exam_type_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.log('Add Exam Type Error', error);
    },
  });
};

export const useEditExamType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ExamType) => {
      const response = await api.put(`/exam_type/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Edit Exam Type Success');
      queryClient.invalidateQueries({ queryKey: ['exam_type_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.log('Edit Exam Type Error', error);
    },
  });
};

export const useDeleteExamType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number }) => {
      const response = await api.delete(`/exam_type/${data.id}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Delete Exam Type Success');
      queryClient.invalidateQueries({ queryKey: ['exam_type_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.log('Delete Exam Type Error', error);
    },
  });
};
