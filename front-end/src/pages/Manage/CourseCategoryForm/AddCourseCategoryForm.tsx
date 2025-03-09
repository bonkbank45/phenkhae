import React from 'react';
import { useAddCourseCategory } from '../../../hooks/api/basicData/useCourseCategoryData';
import { ErrorResponse } from '../../../types/error_response';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';

interface CourseCategory {
  id?: number;
  category_name: string;
}

const AddEducationQualForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const { mutate: addCategory, isPending: isAddingCategory } =
    useAddCourseCategory();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CourseCategory>({
    resolver: yupResolver(
      yup.object().shape({
        id: yup
          .number()
          .nullable()
          .transform((value, originalValue) =>
            originalValue === '' ? null : value,
          )
          .typeError('id ต้องเป็นตัวเลขเท่านั้น')
          .min(0, 'ไม่สามารถกรอกตัวเลขติดลบ'),
        category_name: yup.string().required('กรุณากรอกชื่อประเภทหลักสูตร'),
      }),
    ),
  });

  const onSubmit = handleSubmit((data: CourseCategory) => {
    if (data.id === null) {
      delete data.id;
    }
    console.log(data);
    addCategory(data, {
      onSuccess: () => onSuccess(),
      onError: (error: ErrorResponse) => {
        onError(error);
        if (error.response.data.errors.id) {
          setError('id', {
            message: error.response.data.errors.id[0],
          });
        }
        if (error.response.data.errors.category_name) {
          setError('category_name', {
            message: error.response.data.errors.category_name[0],
          });
        }
      },
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="ไอดี"
        name="id"
        includeRegister={register}
        placeholder="1"
        required={false}
        error={errors.id?.message as string}
      />
      <TextField
        label="ชื่อประเภทหลักสูตร"
        name="category_name"
        includeRegister={register}
        placeholder="หลักสูตรที่รับรองโดย"
        required={true}
        error={errors.category_name?.message as string}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="pt-3 font-notoLoopThaiRegular"
          type="submit"
          loading={isAddingCategory}
          disabled={isAddingCategory}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default AddEducationQualForm;
