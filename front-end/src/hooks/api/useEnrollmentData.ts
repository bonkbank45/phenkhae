import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Enrollment, GroupEnrollmentSubmit } from '../../types/enrollment';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';
import { SelectedBatch } from '../../pages/Student/StudentIndexPage';
import { StudentCourseDataTable } from '../../types/enrollment';

interface StudentSelected {
  id: number;
  firstname_tha: string;
  lastname_tha: string;
}

export const useEnrolledStudentsByBatchId = ({
  courseBatchId,
  searchTerm,
  page,
  ageRange,
  experience,
  education,
  recentlyAdded,
}: {
  courseBatchId: number;
  searchTerm: string;
  page: number;
  ageRange: string;
  experience: string;
  education: string;
  recentlyAdded: string;
}) => {
  const params = new URLSearchParams({
    page: page?.toString() || '1',
    ...(searchTerm && { search: searchTerm }),
    ...(ageRange && { age_range: ageRange }),
    ...(experience && { experience: experience }),
    ...(education && { education: education }),
    ...(recentlyAdded && { recently_added: recentlyAdded }),
  });
  return useQuery({
    queryKey: [
      'enrollments',
      courseBatchId,
      page,
      searchTerm,
      ageRange,
      experience,
      education,
      recentlyAdded,
    ],
    queryFn: async () => {
      const response = await api.get(
        `/enrollment/course-batch/${courseBatchId}?${params}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useEnrolledStudentsByBatchIds = (
  batchData: SelectedBatch[],
  enabled: boolean = false,
  page: number,
) => {
  const params = new URLSearchParams();

  const isAllSelected = batchData.some((batch) => batch.course_id === -1);

  if (!isAllSelected) {
    const batchIds = batchData.map((batch) => batch.batch_id.join(','));
    params.append('batch_ids', batchIds.join(','));
  } else {
    params.append('fetch_all', 'true');
  }
  params.append('page', page.toString() || '1');
  return useQuery({
    queryKey: ['enrollments', isAllSelected ? 'all' : params.toString()],
    queryFn: async () => {
      const response = await api.get(`/enrollment/course-batches?${params}`);
      return response.data;
    },
    enabled: enabled && (isAllSelected || params.toString().length > 0),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
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

export const useEditEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      api.patch(`/enrollment/${data.course_group_id}-${data.student_id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['enrollments'],
        exact: false,
      });
    },
    onError: (error: ErrorResponse) => {
      console.error('Error', error);
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseGroupId: number; studentId: number }) =>
      api.delete(`/enrollment/${data.courseGroupId}`, {
        data: { student_ids: [data.studentId] },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['enrollments'],
        exact: false,
      });
    },
    onError: (error: ErrorResponse) => {
      console.error('Error', error);
    },
  });
};

export const useRemoveEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseGroupId: number; studentIds: number[] }) =>
      api.delete(`/enrollment/${data.courseGroupId}`, {
        data: { student_ids: data.studentIds },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['enrollments'],
        exact: false,
      });
    },
  });
};
