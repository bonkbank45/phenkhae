import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';

export interface AddStudentData {
  address_district: number;
  address_moo: string;
  address_num: string;
  address_province: number;
  address_road?: string;
  address_soi?: string;
  address_sub_district: number;
  address_zip_code: string;
  birth_province: number;
  birthdate: string;
  citizenid_card: string;
  course_training: {
    [key: string]: boolean;
  };
  email: string;
  edu_inses: undefined;
  edu_qual: undefined;
  father_fname: string;
  father_lname: string;
  firstname_eng: string;
  firstname_tha: string;
  lastname_eng: string;
  lastname_tha: string;
  marital_status: number;
  learn_massage_description: string | null;
  work_massage_description: string | null;
  medical_condition: number | null;
  mother_fname: string;
  mother_lname: string;
  prename_tha: number;
  surgery_history: string | null;
}

export const useStudentDataById = (id: number) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const response = await api.get(`/student/${id}`);
      return response.data;
    },
  });
};

export const useStudentData = ({
  searchTerm,
  courseBatchId,
  recentlyAdded,
  ageRange,
  experience,
  education,
  page,
}: {
  searchTerm: string;
  courseBatchId?: string;
  recentlyAdded?: string;
  ageRange?: string;
  experience?: string;
  education?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: [
      'students',
      searchTerm,
      courseBatchId,
      recentlyAdded,
      ageRange,
      experience,
      education,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page?.toString() || '1',
        ...(searchTerm && { search: searchTerm }),
        ...(courseBatchId && { course_group_id: courseBatchId }),
        ...(recentlyAdded && { recently_added: recentlyAdded }),
        ...(ageRange && { age_range: ageRange }),
        ...(experience && { experience: experience }),
        ...(education && { education: education }),
      });
      const response = await api.get(`/student/table?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useAddStudentData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddStudentData) => {
      const response = await api.post('/student', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (response) => {
      console.log('Success', response.data);
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });
    },
    onError: (error: Error) => {
      console.error('Failed to add student:', error.message);
    },
  });
};

export const useStudentCount = () => {
  return useQuery({
    queryKey: ['students', 'count'],
    queryFn: async () => {
      const response = await api.get('/student/count');
      return response.data;
    },
  });
};

export const useDeleteStudentData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/student/${id}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Delete StudentSuccess!');
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });
      queryClient.invalidateQueries({
        queryKey: ['enrollments'],
        exact: false,
      });
    },
    onError: (error: Error) => {
      console.error('Delete Student Failed!', error.message);
    },
  });
};
