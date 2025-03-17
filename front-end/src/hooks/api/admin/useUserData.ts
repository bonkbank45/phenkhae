import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { ErrorResponse } from '../../../types/error_response';

export const useUserDataTable = (search: string, page: number) => {
  return useQuery({
    queryKey: ['user_data', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(search && { search: search }),
        ...(page && { page: page.toString() }),
      });
      const response = await api.get(`/user/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      firstname: string;
      lastname: string;
    }) => {
      const response = await api.put(`/user/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Edit user complete');
      queryClient.invalidateQueries({ queryKey: ['user_data'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/user/${id}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Deleted user complete');
      queryClient.invalidateQueries({ queryKey: ['user_data'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
