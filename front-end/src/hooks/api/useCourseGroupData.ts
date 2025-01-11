import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const useCourseGroupData = () => {
  return useQuery({
    queryKey: ['course_group_data'],
    queryFn: () => api.get('/course_group'),
  });
};

export const useCourseGroupDataByCourseId = (courseId: number) => {
  return useQuery({
    queryKey: ['course_group_data_by_course_id', courseId],
    queryFn: () => api.get(`/course_group/course/${courseId}`),
  });
};
