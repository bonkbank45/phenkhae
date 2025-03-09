import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { ErrorResponse } from '../../../types/error_response';

export const useEducationQualDataTable = (search: string, page: number) => {
  return useQuery({
    queryKey: ['education_qual_data', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(search && { search: search }),
        ...(page && { page: page.toString() }),
      });
      const response = await api.get(`/education_qual/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const addEducationQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/education_qual', data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Add Education Qual onSuccess');
      queryClient.invalidateQueries({ queryKey: ['education_qual_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error('Add Education Qual onError', error);
    },
  });
};

export const editEducationQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/education_qual/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Edit Education Qual onSuccess');
      queryClient.invalidateQueries({ queryKey: ['education_qual_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error('Edit Education Qual onError', error);
    },
  });
};

export const deleteEducationQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.delete(`/education_qual/${data.id}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Delete Education Qual onSuccess');
      queryClient.invalidateQueries({ queryKey: ['education_qual_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error('Delete Education Qual onError', error);
    },
  });
};
