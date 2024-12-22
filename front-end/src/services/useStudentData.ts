import { useMutation } from '@tanstack/react-query';
import api from './axios/axiosClient';

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

export const useAddStudentData = (data: AddStudentData) => {
  return useMutation({
    mutationFn: async (data: AddStudentData) => {
      const response = await api.post('/student', data);
      return response.data;
    },
    onSuccess: (response) => {
      console.log('Success', response.data);
    },
    onError: (error: Error) => {
      console.error('Failed to add student:', error.message);
    },
  });
};
