import React from 'react';
import TextField from '../../../../components/Forms/TextField';
import { useForm } from 'react-hook-form';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useExamInvidualUpdate } from '../../../../hooks/api/useExamInvidual';
import { ErrorResponse } from '../../../../types/error_response';
const EditCourseBatchExamView = ({
  selectedExamInvidual,
  onSuccess,
  onError,
}) => {
  const { mutate: updateExamInvidual, isPending: isUpdateExamInvidualPending } =
    useExamInvidualUpdate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        score_get: yup
          .number()
          .typeError('กรุณากรอกคะแนน')
          .required('กรุณากรอกคะแนน')
          .min(0, 'คะแนนต้องมากกว่า 0'),
      }),
    ),
    defaultValues: {
      score_get: selectedExamInvidual.score_get,
    },
  });

  const onSubmit = (data) => {
    console.log({ ...selectedExamInvidual, score_get: Number(data.score_get) });
    updateExamInvidual(
      {
        ...selectedExamInvidual,
        score_get: Number(data.score_get),
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          setError('score_get', { message: error.response.data.message });
          onError(error);
        },
      },
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <span className="font-notoLoopThaiRegular">
          ชื่อนักเรียน : {selectedExamInvidual.student.firstname_tha}{' '}
          {selectedExamInvidual.student.lastname_tha}
        </span>
      </div>
      <TextField
        label="คะแนน"
        name="score_get"
        includeRegister={register}
        error={errors.score_get?.message as string}
      />
      <div className="mt-4 flex justify-end">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          disabled={isUpdateExamInvidualPending}
          loading={isUpdateExamInvidualPending}
          onClick={handleSubmit(onSubmit)}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};

export default EditCourseBatchExamView;
