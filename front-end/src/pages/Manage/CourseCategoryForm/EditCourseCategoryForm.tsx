import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse } from '../../../types/error_response';
import { useUpdateCourseCategory } from '../../../hooks/api/basicData/useCourseCategoryData';

interface CourseCategory {
  id: number;
  category_name: string;
}

const EditCourseCategoryForm = ({
  initialData,
  onSuccess,
  onError,
}: {
  initialData: CourseCategory;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_name: initialData.category_name,
    },
    resolver: yupResolver(
      yup.object().shape({
        category_name: yup
          .string()
          .required('กรุณากรอกชื่อหมวดหมู่หลักสูตร'),
      }),
    ),
  });

  const { mutate: updateCategory, isPending: isUpdatingCategory } =
    useUpdateCourseCategory();

  const onSubmit = (data: CourseCategory) => {
    updateCategory(
      {
        id: initialData.id,
        category_name: data.category_name,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.errors.category_name) {
            setError('category_name', {
              message: error.response.data.errors.category_name[0],
            });
          }
          onError(error);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <TextField
        label="ชื่อหมวดหมู่หลักสูตร"
        includeRegister={register}
        name="category_name"
        placeholder="หมวดหมู่หลักสูตร"
        required={true}
        error={errors.category_name?.message}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          type="submit"
          disabled={isUpdatingCategory}
          loading={isUpdatingCategory}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default EditCourseCategoryForm;
