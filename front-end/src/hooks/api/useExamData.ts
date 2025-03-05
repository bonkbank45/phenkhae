import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';
import { ExamTable } from '../../types/exam';
export const useExamTableDataByCourseBatchId = (courseBatchId: number) => {
  return useQuery({
    queryKey: ['exam', 'course_batch', courseBatchId],
    queryFn: async () => {
      const response = await api.get(
        `/exam/course_batch/${courseBatchId}/table`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: (prevData) => prevData,
  });
};

export const useExamDataByExamId = (examId: number) => {
  return useQuery({
    queryKey: ['exam', examId],
    queryFn: async () => {
      const response = await api.get(`/exam/${examId}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useAddExam = (courseBatchId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ExamTable) => {
      const response = await api.post(`/exam`, data);
      return response.data;
    },
    onSuccess: () => {
      console.log('เพิ่มข้อมูลการสอบเรียบร้อย');
      queryClient.invalidateQueries({ queryKey: ['exam'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useUpdateExam = (examId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ExamTable) => {
      const response = await api.put(`/exam/${examId}`, data);
      return response.data;
    },
    onSuccess: () => {
      console.log('อัพเดทข้อมูลการสอบเรียบร้อย');
      queryClient.invalidateQueries({ queryKey: ['exam'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};

export const useDeleteExam = (examId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/exam/${examId}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('ลบข้อมูลการสอบเรียบร้อย');
      queryClient.invalidateQueries({ queryKey: ['exam'] });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
};
