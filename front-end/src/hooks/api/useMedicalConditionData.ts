import { useQuery } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';

interface MedicalConditionResponse {
  status: string;
  message: string | null;
  data: MedicalCondition[] | null[];
}

interface MedicalCondition {
  id: number;
  name: string;
}

export const useMedicalConditionData = () => {
  return useQuery({
    queryKey: ['medicalConditionData'],
    queryFn: () =>
      api
        .get<MedicalConditionResponse>('medical_condition')
        .then((res) => res.data),
  });
};
