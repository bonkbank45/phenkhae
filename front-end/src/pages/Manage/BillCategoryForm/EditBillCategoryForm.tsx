import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse } from '../../../types/error_response';
import { useEditBillCategory } from '../../../hooks/api/basicData/useBillCategoryData';

interface BillCategory {
  id: number;
  category_bill_name: string;
}

const EditBillCategoryForm = ({
  initialData,
  onSuccess,
  onError,
}: {
  initialData: BillCategory;
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
      category_bill_name: initialData.category_bill_name,
    },
    resolver: yupResolver(
      yup.object().shape({
        category_bill_name: yup
          .string()
          .required('กรุณากรอกชื่อหมวดหมู่ใบเสร็จ'),
      }),
    ),
  });

  const { mutate: editBillCategory, isPending: isUpdatingCategory } =
    useEditBillCategory();

  const onSubmit = (data: BillCategory) => {
    editBillCategory(
      {
        id: initialData.id,
        category_bill_name: data.category_bill_name,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.errors.category_bill_name) {
            setError('category_bill_name', {
              message: error.response.data.errors.category_bill_name[0],
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
        label="ชื่อหมวดหมู่ใบเสร็จ"
        includeRegister={register}
        name="category_bill_name"
        placeholder="หมวดหมู่ใบเสร็จ"
        required={true}
        error={errors.category_bill_name?.message}
      />
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          type="submit"
          disabled={isUpdatingCategory}
          loading={isUpdatingCategory}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default EditBillCategoryForm;
