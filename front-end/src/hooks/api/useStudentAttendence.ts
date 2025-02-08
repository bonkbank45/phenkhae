import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useStudentAttendence = (courseAttendenceId: number) => {
  return useQuery({
    queryKey: ['studentAttendence', courseAttendenceId],
    queryFn: async () => {
      const response = await api.get(
        `/student_attendence/course_attendence/${courseAttendenceId}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: (prevData) => prevData,
  });
};

export const useStudentAttendenceBulkUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/student_attendence`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAttendence'] });
    },
    onError: (error) => {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
    },
  });
};
