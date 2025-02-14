import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '../../types/error_response';
import api from '../../services/api';

export const useAddLicenseQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/student_license_qual', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student_license_qual'] });
      console.log('success');
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};

export const useAddBulkLicenseQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/student_license_qual/bulk', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student_license_qual'] });
      console.log('success');
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};
