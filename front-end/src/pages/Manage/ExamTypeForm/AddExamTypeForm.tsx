import React from 'react';
import { useAddExamType } from '../../../hooks/api/basicData/useExamTypeData';
import { ErrorResponse } from '../../../types/error_response';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';

interface ExamType {
  id: number;
  exam_type_name: string;
}

interface ExamTypeForm {
  id?: number;
  exam_type_name: string;
}

const AddExamTypeForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const { mutate: addExamType, isPending: isAddingExamType } = useAddExamType();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ExamTypeForm>({
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
        exam_type_name: yup.string().required('กรุณากรอกชื่อประเภทการสอบ'),
      }),
    ),
  });

  const onSubmit = handleSubmit((data: ExamType) => {
    if (data.id === null) {
      delete data.id;
    }
    addExamType(data, {
      onSuccess: () => onSuccess(),
      onError: (error: ErrorResponse) => {
        onError(error);
        if (error.response.data.errors.id) {
          setError('id', {
            message: error.response.data.errors.id[0],
          });
        }
        if (error.response.data.errors.exam_type_name) {
          setError('exam_type_name', {
            message: error.response.data.errors.exam_type_name[0],
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
        label="ชื่อประเภทการสอบ"
        name="exam_type_name"
        includeRegister={register}
        placeholder="ทฤษฎี"
        required={true}
        error={errors.exam_type_name?.message as string}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="pt-3 font-notoLoopThaiRegular"
          type="submit"
          loading={isAddingExamType}
          disabled={isAddingExamType}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default AddExamTypeForm;
