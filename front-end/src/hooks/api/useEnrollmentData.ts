import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Enrollment, GroupEnrollmentSubmit } from '../../types/enrollment';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';

export const useEnrolledStudentsByBatchId = (
  courseBatchId: number,
  // searchTerm: string,
  page: number,
) => {
  const params = new URLSearchParams({
    page: page?.toString() || '1',
    // ...(searchTerm && { search: searchTerm }),
  });
  return useQuery({
    queryKey: ['enrollments', courseBatchId, page],
    queryFn: () =>
      api.get(`/enrollment/course-batch/${courseBatchId}?${params}`),
  });
};

export const useAddEnrolledStudents = () => {
  const queryClient = useQueryClient();
  // Reminder: add api.post<HERE> later
  return useMutation({
    mutationFn: (data: GroupEnrollmentSubmit) => api.post('/enrollment', data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['enrollments'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['course_batch_data'],
        exact: false,
      });
      console.log('เพิ่มการสมัครสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.error('Error', error);
    },
  });
};

export const useRemoveEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupEnrollmentSubmit) =>
      api.delete('/enrollment', { data }),
  });
};
