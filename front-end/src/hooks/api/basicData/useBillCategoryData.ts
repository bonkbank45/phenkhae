import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { ErrorResponse } from '../../../types/error_response';

interface BillCategory {
  id: number;
  category_bill_name: string;
}

export const useBillCategoryDataTable = (search: string, page: number) => {
  return useQuery({
    queryKey: ['bill_category_data', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(search && { search: search }),
        ...(page && { page: page.toString() }),
      });
      const response = await api.get(`/course_category_bill/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useAddBillCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BillCategory) => {
      const response = await api.post('/course_category_bill', data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Add Bill Category Success');
      queryClient.invalidateQueries({ queryKey: ['bill_category_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error('Add Bill Category Error', error);
    },
  });
};

export const useEditBillCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BillCategory) => {
      const response = await api.put(`/course_category_bill/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Edit Bill Category Success');
      queryClient.invalidateQueries({ queryKey: ['bill_category_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error('Edit Bill Category Error', error);
    },
  });
};

export const useDeleteBillCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/course_category_bill/${id}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Delete Bill Category Success');
      queryClient.invalidateQueries({ queryKey: ['bill_category_data'] });
    },
    onError: (error: ErrorResponse) => {
      console.error('Delete Bill Category Error', error);
    },
  });
};
