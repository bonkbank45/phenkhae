import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import api from '../../services/api';

export const useCourseAttendenceByCourseGroupId = (courseGroupId: number) => {
  return useQuery({
    queryKey: ['courseAttendenceByCourseGroupId', courseGroupId],
    queryFn: async () => {
      const response = await api.get(
        `/course_attendence/course_group/${courseGroupId}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: (prevData) => prevData,
  });
};

export const useCourseAttendenceById = (id: number) => {
  return useQuery({
    queryKey: ['courseAttendence', id],
    queryFn: async () => {
      const response = await api.get(`/course_attendence/${id}`);
      return response.data;
    },
  });
};

export const useAddCourseAttendence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/course_attendence', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courseAttendence'],
        exact: false,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCourseAttendence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/course_attendence/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courseAttendence'],
        exact: false,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
