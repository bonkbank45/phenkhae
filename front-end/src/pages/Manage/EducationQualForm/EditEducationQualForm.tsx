import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { editEducationQual } from '../../../hooks/api/basicData/useEducationQualData';
import { ErrorResponse } from '../../../types/error_response';

interface EducationQual {
  id: number;
  edu_qual_name: string;
  edu_qual_eng: string;
}

const EditEducationQualForm = ({
  initialData,
  onSuccess,
  onError,
}: {
  initialData: EducationQual;
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
      edu_qual_name: initialData.edu_qual_name,
      edu_qual_eng: initialData.edu_qual_eng,
    },
    resolver: yupResolver(
      yup.object().shape({
        edu_qual_name: yup
          .string()
          .matches(
            /^[ก-๙0-9\s]+$/,
            'กรุณากรอกชื่อวุฒิการศึกษาภาษาไทยให้ถูกต้อง',
          )
          .required('กรุณากรอกชื่อวุฒิการศึกษา'),
        edu_qual_eng: yup
          .string()
          .matches(
            /^[A-Za-z0-9\s]+$/,
            'กรุณากรอกชื่อวุฒิการศึกษาภาษาอังกฤษให้ถูกต้อง',
          )
          .optional()
          .transform((value) => (value === '' ? undefined : value)),
      }),
    ),
  });

  const { mutate: editQual, isPending: isEditingQual } = editEducationQual();

  const onSubmit = (data: EducationQual) => {
    editQual(
      {
        id: initialData.id,
        edu_qual_name: data.edu_qual_name,
        edu_qual_eng: data.edu_qual_eng || null,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.errors.edu_qual_name) {
            setError('edu_qual_name', {
              message: error.response.data.errors.edu_qual_name[0],
            });
          }
          if (error.response.data.errors.edu_qual_eng) {
            setError('edu_qual_eng', {
              message: error.response.data.errors.edu_qual_eng[0],
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
        label="วุฒิการศึกษา"
        includeRegister={register}
        name="edu_qual_name"
        placeholder="ปริญญาตรี"
        required={true}
        error={errors.edu_qual_name?.message}
      />
      <TextField
        label="วุฒิการศึกษา (อังกฤษ)"
        includeRegister={register}
        name="edu_qual_eng"
        placeholder="Bachelor's Degree"
        required={false}
        error={errors.edu_qual_eng?.message}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          type="submit"
          disabled={isEditingQual}
          loading={isEditingQual}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default EditEducationQualForm;
