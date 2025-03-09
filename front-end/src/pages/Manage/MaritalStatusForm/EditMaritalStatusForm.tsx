import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateMaritalData } from '../../../hooks/api/basicData/useMaritalData';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../types/error_response';
interface MaritalStatus {
  id: number;
  marital_name: string;
}

const EditMaritalStatusForm = ({
  initialData,
  onSuccess,
  onError,
}: {
  initialData: MaritalStatus;
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
      marital_name: initialData.marital_name,
    },
    resolver: yupResolver(
      yup.object().shape({
        marital_name: yup.string().required('กรุณากรอกชื่อสถานะ'),
      }),
    ),
  });

  const { mutate: updateMaritalData, isPending: isUpdatingMaritalData } =
    useUpdateMaritalData();

  const onSubmit = (data: MaritalStatus) => {
    updateMaritalData(
      {
        id: initialData.id,
        marital_name: data.marital_name,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.errors.marital_name) {
            setError('marital_name', {
              message: error.response.data.errors.marital_name[0],
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
        label="ชื่อสถานะ"
        includeRegister={register}
        name="marital_name"
        placeholder="โสด"
        required={true}
        error={errors.marital_name?.message}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          type="submit"
          disabled={isUpdatingMaritalData}
          loading={isUpdatingMaritalData}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default EditMaritalStatusForm;
