import { AxiosResponse } from 'axios';
import api from './axios/axiosClient';
export const login = (email: string, password: string) => {
  return api.post('/login', { email, password });
};

export const logout = () => {
  const token = localStorage.getItem('authToken');
  return api.post(
    '/logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const fetchUser = () => {
  const token = localStorage.getItem('authToken');
  return api.get('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchMaritalStatuses = () => {
  return api.get('/marital_status');
};

export const fetchMedicalConditions = () => {
  return api.get('/medical_condition');
};

export const fetchProvinces = () => {
  return api.get('/province');
};

export const fetchDistricts = () => {
  return api.get('/district');
};

export const fetchStudentById = (studentId: string) => {
  return api.get(`/student/${studentId}`);
};

export const fetchPrefixNames = async (
  isEditMode: boolean = false,
): Promise<
  AxiosResponse<
    {
      id: number;
      prename_tha: string;
      prename_eng: string;
      prename_short_tha?: string;
      prename_short_eng?: string;
    }[]
  >
> => {
  return await api.get(
    `/prename?${isEditMode ? 'show_status=all' : 'show_status=1'}`,
  );
};

export default api;
