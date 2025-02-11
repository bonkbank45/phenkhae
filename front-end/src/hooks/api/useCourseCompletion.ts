import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';

export const useCourseCompletion = () => {
  return useMutation({
    mutationFn: (data: {
      course_group_id: number;
      student_id: number;
      completion_date: string;
    }) => api.post('/course_completion', data),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};
