import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { coursePriceEditSchema } from '../../../schema/courses/coursePriceEdit';
import { useUpdateCoursePrice } from '../../../hooks/api/useCoursePrice';
import { ErrorResponse } from '../../../types/error_response';
import { CoursePriceForm } from './CoursePriceForm';

const EditCoursePrice = ({ initialData, onSuccess, onError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_price: initialData.course_prices.find(
        (price) => price.date_end === null,
      )?.price,
      new_price: '',
    },
    resolver: yupResolver(coursePriceEditSchema),
  });

  const { mutate: updateCoursePrice, isPending } = useUpdateCoursePrice();

  const onSubmit = (data) => {
    updateCoursePrice(
      {
        course_price_id: initialData.course_prices.find(
          (price) => price.date_end === null,
        )?.id,
        new_price: data.new_price,
      },
      {
        onSuccess: () => {
          console.log('แก้ไขราคาหลักสูตรสำเร็จ');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.error(error.message || 'เกิดข้อผิดพลาดในการแก้ไข');
          onError();
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 font-notoLoopThaiRegular">
        แก้ไขราคาหลักสูตร {initialData.course_name}
      </h1>
      <CoursePriceForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isPending={isPending}
        isEdit={true}
        currentPrice={
          initialData.course_prices.find((price) => price.date_end === null)
            ?.price
        }
      />
    </div>
  );
};

export default EditCoursePrice;
