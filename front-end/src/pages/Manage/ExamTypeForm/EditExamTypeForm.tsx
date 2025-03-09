import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditExamType } from '../../../hooks/api/basicData/useExamTypeData';
import { ErrorResponse } from '../../../types/error_response';

interface ExamType {
  id: number;
  exam_type_name: string;
}

const EditExamTypeForm = ({
  initialData,
  onSuccess,
  onError,
}: {
  initialData: ExamType;
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
      exam_type_name: initialData.exam_type_name,
    },
    resolver: yupResolver(
      yup.object().shape({
        exam_type_name: yup.string().required('กรุณากรอกชื่อประเภทการสอบ'),
      }),
    ),
  });

  const { mutate: editExamType, isPending: isEditExamTypePending } =
    useEditExamType();

  const onSubmit = (data: ExamType) => {
    editExamType(
      {
        id: initialData.id,
        exam_type_name: data.exam_type_name,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.errors.exam_type_name) {
            setError('exam_type_name', {
              message: error.response.data.errors.exam_type_name[0],
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
        label="ชื่อประเภทการสอบ"
        includeRegister={register}
        name="exam_type_name"
        placeholder="สอบข้อเขียน"
        required={true}
        error={errors.exam_type_name?.message}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          type="submit"
          disabled={isEditExamTypePending}
          loading={isEditExamTypePending}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default EditExamTypeForm;
