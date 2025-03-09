import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { ErrorResponse } from '../../../types/error_response';

export const useOccupationDataTable = (search: string, page: number) => {
  return useQuery({
    queryKey: ['occupations', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(search && { search: search }),
        ...(page && { page: page.toString() }),
      });
      const response = await api.get(`/occupation/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useAddOccupation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/occupation', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupations'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useEditOccupation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/occupation/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupations'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useDeleteOccupation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.delete(`/occupation/${data.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupations'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};
