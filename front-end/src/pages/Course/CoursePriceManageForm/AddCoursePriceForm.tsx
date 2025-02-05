import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { coursePriceEditSchema } from '../../../schema/courses/coursePriceEdit';
import { CoursePriceForm } from './CoursePriceForm';
import { useAddCoursePrice } from '../../../hooks/api/useCoursePrice';

interface AddCoursePriceFormProps {
  onSuccess: () => void;
  onError: () => void;
  courseId: string | number;
}

const AddCoursePriceForm: React.FC<AddCoursePriceFormProps> = ({
  onSuccess,
  onError,
  courseId,
}) => {
  const { mutate: addCoursePrice, isPending: isAddPending } =
    useAddCoursePrice();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      new_price: '',
    },
    resolver: yupResolver(coursePriceEditSchema),
  });

  const onSubmit = (data) => {
    addCoursePrice(
      {
        course_id: Number(courseId),
        price: data.new_price,
      },
      {
        onSuccess: () => {
          console.log('เพิ่มราคาหลักสูตรสำเร็จ');
          onSuccess();
        },
        onError: () => {
          console.log('เพิ่มราคาหลักสูตรล้มเหลว');
          onError();
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 font-notoLoopThaiRegular">
        เพิ่มราคาหลักสูตรใหม่
      </h1>
      <CoursePriceForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isPending={isAddPending}
        isEdit={false}
      />
    </div>
  );
};

export default AddCoursePriceForm;
