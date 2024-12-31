import { useQuery } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';

interface OccupationResponse {
  status: string;
  message: string | null;
  data: Occupation[];
}

interface Occupation {
  id: string;
  occupation_name: string;
}

export const useOccupationData = () => {
  return useQuery({
    queryKey: ['occupationData'],
    queryFn: () =>
      api.get<OccupationResponse>('occupation').then((res) => res.data),
  });
};
