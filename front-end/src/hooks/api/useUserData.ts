import { useMutation } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';

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

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (data: SetPasswordData) => api.post('/set-password', data),
    onError: (error: any) => {
      console.error(error.response.data);
    },
  });
};
