import { useQuery } from '@tanstack/react-query';
import api from './axios/axiosClient';

interface EducationQualResponse {
  status: string;
  message: string | null;
  data: EducationQual[];
}

interface EducationQual {
  id: string;
  edu_qual_name: string;
  edu_qual_eng: string | null;
  status: number;
}

export const useEducationQual = () => {
  return useQuery({
    queryKey: ['education-qual'],
    queryFn: () =>
      api.get<EducationQualResponse>('/education_qual').then((res) => res.data),
  });
};
