import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';
import { ErrorResponse } from '../../types/error_response';

interface PrenameFormData {
  id: number;
  prename_tha: string;
  prename_eng: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
  show_status: number;
}

export const usePrenameData = () => {
  return useQuery({
    queryKey: ['prename'],
    queryFn: () => api.get<PrenameFormData[]>('/prename'),
  });
};

export const useAddPrename = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PrenameFormData) =>
      api.post<PrenameFormData>('/prename', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prename'], exact: false });
      console.log('Prename added successfully');
    },
    onError: (error: ErrorResponse) => {
      console.log(error.message);
    },
  });
};

export const useUpdatePrename = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PrenameFormData) =>
      api.put<PrenameFormData>(`/prename/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prename'], exact: false });
      console.log('Prename updated successfully');
    },
    onError: (error: ErrorResponse) => {
      console.log(error.message);
    },
  });
};

export const useDeletePrename = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/prename/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prename'], exact: false });
      console.log('Prename deleted successfully');
    },
    onError: (error: ErrorResponse) => {
      console.log(error.message);
    },
  });
};
