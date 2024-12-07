import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

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

export default api;
