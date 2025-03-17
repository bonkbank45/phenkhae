import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';
import { ErrorResponse } from '../../types/error_response';
interface AddEmployeeData {
  email: string;
  firstname: string;
  lastname: string;
}

interface SetPasswordData {
  token: string;
  password: string;
  password_confirmation: string;
}

export const useAddEmployeeData = () => {
  return useMutation({
    mutationFn: (data: AddEmployeeData) => api.post('/employees', data),
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      data.append('_method', 'PUT');
      return api.post(`/user/${data.get('id')}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_data'] });
      console.log('Edit user complete');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (data: SetPasswordData) => api.post('/set-password', data),
    onError: (error: ErrorResponse) => {
      console.error(error.response.data);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => api.post('/reset-password', data),
    onSuccess: (data: any) => {
      console.log(data);
    },
    onError: (error: ErrorResponse) => {
      console.error(error.response.data);
    },
  });
};
