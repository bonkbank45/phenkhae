import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Enrollment, GroupEnrollmentSubmit } from '../../types/enrollment';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';

export const useAddEnrollment = () => {
  const queryClient = useQueryClient();
  // Reminder: add api.post<HERE> later
  return useMutation({
    mutationFn: (data: GroupEnrollmentSubmit) => api.post('/enrollment', data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['enrollments'],
        exact: false,
      });
      console.log('เพิ่มการสมัครสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.error('Error', error);
    },
  });
};
