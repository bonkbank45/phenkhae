import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { ErrorResponse } from '../../types/error_response';

interface UpdateCoursePriceProps {
  course_price_id: number;
  new_price: number;
}

interface AddCoursePriceProps {
  course_id: number;
  price: number;
}

export const useAddCoursePrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddCoursePriceProps) => api.post(`/course_price`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false });
      console.log('เพิ่มราคาหลักสูตรสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.error(error.message || 'เกิดข้อผิดพลาดในการเพิ่ม');
    },
  });
};

export const useUpdateCoursePrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCoursePriceProps) =>
      api.post(`/course_price/${data.course_price_id}`, {
        new_price: data.new_price,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false });
      console.log('แก้ไขราคาหลักสูตรสำเร็จ');
    },
    onError: (error: ErrorResponse) => {
      console.error(error.message || 'เกิดข้อผิดพลาดในการแก้ไข');
    },
  });
};
