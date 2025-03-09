import React from 'react';
import { addEducationQual } from '../../../hooks/api/basicData/useEducationQualData';
import { ErrorResponse } from '../../../types/error_response';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';

const AddEducationQualForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const { mutate: addEducation, isPending: isAddingEducation } =
    addEducationQual();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        id: yup.string().required('กรุณากรอกไอดี'),
        edu_qual_name: yup
          .string()
          .matches(
            /^[ก-๙0-9\s]+$/,
            'กรุณากรอกชื่อวุฒิการศึกษาภาษาไทยให้ถูกต้อง',
          )
          .required('กรุณากรอกชื่อวุฒิการศึกษาภาษาไทย'),
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

  const onSubmit = handleSubmit((data) => {
    addEducation(
      { ...data, status: 1 },
      {
        onSuccess: () => onSuccess(),
        onError: (error: ErrorResponse) => {
          onError(error);
          if (error.response.data.errors.id) {
            setError('id', {
              message: error.response.data.errors.id[0],
            });
          }
          if (error.response.data.errors.edu_qual_name) {
            setError('edu_qual_name', {
              message: error.response.data.errors.edu_qual_name[0],
            });
          }
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="ไอดี"
        name="id"
        includeRegister={register}
        placeholder="1"
        required={true}
        error={errors.id?.message as string}
      />
      <TextField
        label="ชื่อวุฒิการศึกษาภาษาไทย"
        name="edu_qual_name"
        includeRegister={register}
        placeholder="ปริญญาตรี"
        required={true}
        error={errors.edu_qual_name?.message as string}
      />
      <TextField
        label="ชื่อวุฒิการศึกษาภาษาอังกฤษ"
        name="edu_qual_eng"
        includeRegister={register}
        placeholder="Bachelor's Degree"
        required={false}
        error={errors.edu_qual_eng?.message as string}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="pt-3 font-notoLoopThaiRegular"
          type="submit"
          loading={isAddingEducation}
          disabled={isAddingEducation}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default AddEducationQualForm;
