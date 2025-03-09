import React from 'react';
import { useAddOccupation } from '../../../hooks/api/basicData/useOccupationData';
import { ErrorResponse } from '../../../types/error_response';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';

const AddOccupationForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const { mutate: addOccupation, isPending: isAddingOccupation } =
    useAddOccupation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        occupation_name: yup.string().required('กรุณากรอกชื่ออาชีพ'),
      }),
    ),
  });

  const onSubmit = handleSubmit((data) => {
    addOccupation(data, {
      onSuccess: () => onSuccess(),
      onError: (error: ErrorResponse) => {
        onError(error);
        if (error.response.data.errors.id) {
          setError('id', {
            message: error.response.data.errors.id[0],
          });
        }
        if (error.response.data.errors.occupation_name) {
          setError('occupation_name', {
            message: error.response.data.errors.occupation_name[0],
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
        required={true}
        error={errors.id?.message as string}
      />
      <TextField
        label="ชื่ออาชีพ"
        name="occupation_name"
        includeRegister={register}
        placeholder="พนักงานบริษัท"
        required={true}
        error={errors.occupation_name?.message as string}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="pt-3 font-notoLoopThaiRegular"
          type="submit"
          loading={isAddingOccupation}
          disabled={isAddingOccupation}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default AddOccupationForm;
