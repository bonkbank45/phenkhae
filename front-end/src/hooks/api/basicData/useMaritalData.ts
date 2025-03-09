import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { ErrorResponse } from '../../../types/error_response';

export const useMaritalDataTable = (search: string, page: number) => {
  return useQuery({
    queryKey: ['marital_statuses', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(search && { search: search }),
        ...(page && { page: page.toString() }),
      });
      const response = await api.get(`/marital_status/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateMaritalData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; marital_name: string }) => {
      const response = await api.put(`/marital_status/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marital_statuses'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useAddMaritalData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; marital_name: string }) => {
      const response = await api.post('/marital_status', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marital_statuses'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteMaritalData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number }) => {
      const response = await api.delete(`/marital_status/${data.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marital_statuses'] });
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};
