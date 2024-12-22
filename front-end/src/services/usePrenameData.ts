import { useMutation, useQuery } from '@tanstack/react-query';
import api from './axios/axiosClient';

interface PrenameFormData {
  prename_tha: string;
  prename_eng: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
}

export const usePrenameData = () => {
  return useQuery({
    queryKey: ['prename'],
    queryFn: () => api.get<PrenameFormData[]>('/prename'),
  });
};

export const useAddPrename = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: PrenameFormData) => api.post('/prename', data),
    onSuccess: () => {
      console.log('Prename added successfully');
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  return { mutate, isPending, isError, error };
};

export const useUpdatePrename = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { id: number } & PrenameFormData) =>
      api.put(`/prename/${data.id}`, data),
  });
  return { mutate, isPending, isError, error };
};

export const useDeletePrename = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (id: number) => api.delete(`/prename/${id}`),
  });
  return { mutate, isPending, isError, error };
};
