import { useQuery } from '@tanstack/react-query';
import api from './axios/axiosClient';

export const useAddressData = (provinceId?: string, districtId?: string) => {
  const {
    data: provinces,
    isLoading: isLoadingProvinces,
    error: provinceError,
  } = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      try {
        const res = await api.get('/province');
        const provinceData = Array.isArray(res.data) ? res.data : res.data.data;

        return provinceData.map(
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
      } catch (error) {
        console.error('Province fetch error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: districts } = useQuery({
    queryKey: ['districts', provinceId],
    queryFn: () =>
      api.get(`/province/${provinceId}/district`).then((res) => {
        const districtData = Array.isArray(res.data) ? res.data : res.data.data;
        return districtData.map(
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
      api.get(`/district/${districtId}/sub_district`).then((res) => {
        const subDistrictData = Array.isArray(res.data)
          ? res.data
          : res.data.data;
        return subDistrictData.map(
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
