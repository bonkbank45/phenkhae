import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '../../types/error_response';
import api from '../../services/api';
import { format } from 'date-fns';

export const useGetLicenseQualTable = (
  currentPage: number,
  courseId: string,
  licenseStatus: string,
  searchTerm: string,
  dateSearchStart: Date | null,
  dateSearchEnd: Date | null,
) => {
  return useQuery({
    queryKey: [
      'student_license_qual_table',
      currentPage,
      courseId,
      licenseStatus,
      searchTerm,
      dateSearchStart,
      dateSearchEnd,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(courseId && { course_id: courseId.toString() }),
        ...(licenseStatus && { license_status: licenseStatus.toString() }),
        ...(searchTerm && { search: searchTerm }),
        ...(dateSearchStart && {
          date_search_start: format(dateSearchStart, 'yyyy-MM-dd'),
        }),
        ...(dateSearchEnd && {
          date_search_end: format(dateSearchEnd, 'yyyy-MM-dd'),
        }),
      });
      const response = await api.get(`/student_license_qual/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
};

export const useAddLicenseQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/student_license_qual', data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_unlicensed_table'],
        exact: false,
      });
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};

export const useDeleteLicenseQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/student_license_qual/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_unlicensed_table'],
        exact: false,
      });
      console.log('success');
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};

export const useShowLicenseQual = (id: number) => {
  return useQuery({
    queryKey: ['student_license_qual', id],
    queryFn: async () => {
      const response = await api.get(`/student_license_qual/${id}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateLicenseQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      api.put(`/student_license_qual/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_unlicensed_table'],
        exact: false,
      });
      console.log('success');
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};

export const useAddBulkLicenseQual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/student_license_qual/bulk', data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_qual_table'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['student_license_unlicensed_table'],
        exact: false,
      });
      console.log('success');
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};

export const useGetUnlicensedStudents = ({
  page,
  courseId,
  searchTerm,
}: {
  page: number;
  courseId: string;
  searchTerm: string;
}) => {
  return useQuery({
    queryKey: ['student_license_unlicensed_table', page, courseId, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(courseId && { course_id: courseId.toString() }),
        ...(searchTerm && { search_term: searchTerm }),
      });
      const response = await api.get(
        `/student_license_qual/unlicensed/table?${params}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
};
