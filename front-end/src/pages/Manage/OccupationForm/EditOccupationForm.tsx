import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditOccupation } from '../../../hooks/api/basicData/useOccupationData';
import { ErrorResponse } from '../../../types/error_response';

interface Occupation {
  id: number;
  occupation_name: string;
}

const EditOccupationForm = ({
  initialData,
  onSuccess,
  onError,
}: {
  initialData: Occupation;
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
      occupation_name: initialData.occupation_name,
    },
    resolver: yupResolver(
      yup.object().shape({
        occupation_name: yup.string().required('กรุณากรอกชื่ออาชีพ'),
      }),
    ),
  });

  const { mutate: editOccupation, isPending: isEditPending } =
    useEditOccupation();

  const onSubmit = (data: Occupation) => {
    editOccupation(
      {
        id: initialData.id,
        occupation_name: data.occupation_name,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.errors.occupation_name) {
            setError('occupation_name', {
              message: error.response.data.errors.occupation_name[0],
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
        label="ชื่ออาชีพ"
        includeRegister={register}
        name="occupation_name"
        placeholder="พนักงานบริษัท"
        required={true}
        error={errors.occupation_name?.message}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          type="submit"
          disabled={isEditPending}
          loading={isEditPending}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default EditOccupationForm;
