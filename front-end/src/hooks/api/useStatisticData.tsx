import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';
import { ErrorResponse } from '../../types/error_response';

export const useStatisticData = () => {
  return useQuery({
    queryKey: ['certificate_statistic'],
    queryFn: async () => {
      const response = await api.get('course_completion/certificate/statistic');
      return response.data;
    },
  });
};

export const useCourseGroupStatistics = () => {
  return useQuery({
    queryKey: ['course_group_statistic'],
    queryFn: async () => {
      const response = await api.get('course_group/course_group_statistic');
      return response.data;
    },
  });
};

export const useCourseCompletionStatistics = () => {
  return useQuery({
    queryKey: ['course_completed_statistic'],
    queryFn: async () => {
      const response = await api.get('course_completion/completed/statistic');
      return response.data;
    },
  });
};

export const useCourseCompletedAndTakeCertificateStatistic = () => {
  return useQuery({
    queryKey: ['course_completed_and_take_certificate_statistic'],
    queryFn: async () => {
      const response = await api.get(
        'course_completion/completed_and_take_certificate/statistic',
      );
      return response.data;
    },
  });
};
