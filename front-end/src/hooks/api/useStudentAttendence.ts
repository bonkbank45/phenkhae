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

export const useStudentAttendenceByCourseBatchId = (courseBatchId: number) => {
  return useQuery({
    queryKey: ['studentAttendenceByCourseBatchId', courseBatchId],
    queryFn: async () => {
      const response = await api.get(
        `/student_attendence/course_group/${courseBatchId}`,
      );
      return response.data;
    },
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

export const useStudentAttendenceLargeBulkUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(
        `/student_attendence/large_bulk_update`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAttendence'] });
      console.log('Student attendence updated successfully');
    },
    onError: (error) => {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
    },
  });
};

export const useDeleteStudentAttendence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseAttendenceId,
      studentId,
    }: {
      courseAttendenceId: number;
      studentId: number;
    }) => {
      console.log(courseAttendenceId, studentId);
      const response = await api.delete(
        `/student_attendence/${courseAttendenceId}`,
        { data: { student_id: studentId } },
      );
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
