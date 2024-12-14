import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

export const useCourseData = () => {
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => axios.get('/api/course').then((res) => res.data),
  });
};
