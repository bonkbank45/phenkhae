import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

export const useAddressData = (provinceId?: string, districtId?: string) => {
  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: () =>
      axios.get('/api/province').then((res) => {
        return res.data.map(
          (province: {
            id: number;
            code: number;
            name_in_thai: string;
            name_in_english: string;
          }) => ({
            label: province.name_in_thai,
            value: province.id,
          }),
        );
      }),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: districts } = useQuery({
    queryKey: ['districts', provinceId],
    queryFn: () =>
      axios.get(`/api/province/${provinceId}/district`).then((res) => {
        console.log(res.data);
        return res.data.map(
          (district: {
            id: number;
            code: number;
            name_in_thai: string;
            name_in_english: string;
            province_id: number;
          }) => ({
            label: district.name_in_thai,
            value: district.id,
          }),
        );
      }),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: subDistricts } = useQuery({
    queryKey: ['subDistricts', districtId],
    queryFn: () =>
      axios.get(`/api/district/${districtId}/sub_district`).then((res) => {
        return res.data.map(
          (subDistrict: {
            id: number;
            name_in_thai: string;
            name_in_english: string;
          }) => ({
            label: subDistrict.name_in_thai,
            value: subDistrict.id,
          }),
        );
      }),
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return { provinces, districts, subDistricts };
};
