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
  has_massage_experience_learn: string;
  has_massage_experience_work: string;
  has_medical_condition: string;
  has_surgery_history: string;
  lastname_eng: string;
  lastname_tha: string;
  marital_status: number;
  massage_experience_learn_detail: string | null;
  massage_experience_work_detail: string | null;
  medical_condition: number | null;
  mother_fname: string;
  mother_lname: string;
  prename_tha: number;
  surgery_history: string | null;
}

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
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: Error) => {
      console.error('Failed to add student:', error.message);
    },
  });
};
