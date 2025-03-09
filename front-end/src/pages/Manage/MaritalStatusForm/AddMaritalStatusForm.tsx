import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddMaritalData } from '../../../hooks/api/basicData/useMaritalData';
import { ErrorResponse } from '../../../types/error_response';

const AddMaritalStatusForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error) => void;
}) => {
  const { mutate: addMaritalStatus, isPending: isAddingMaritalStatus } =
    useAddMaritalData();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        marital_name: yup.string().required('กรุณากรอกชื่อสถานะ'),
      }),
    ),
  });

  const onSubmit = (data: any) => {
    addMaritalStatus(data, {
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
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="ชื่อสถานะ"
          name="marital_name"
          includeRegister={register}
          placeholder="โสด"
          required={true}
          error={errors.marital_name?.message as string}
        />
        <div className="flex justify-end mt-4">
          <Button
            color="blue"
            className="pt-3 font-notoLoopThaiRegular"
            type="submit"
            loading={isAddingMaritalStatus}
            disabled={isAddingMaritalStatus}
          >
            บันทึก
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddMaritalStatusForm;
