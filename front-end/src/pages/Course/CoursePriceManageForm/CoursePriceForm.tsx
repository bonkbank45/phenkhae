import React from 'react';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CoursePriceFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  isEdit?: boolean;
  currentPrice?: string | number;
}

export const CoursePriceForm: React.FC<CoursePriceFormProps> = ({
  register,
  errors,
  onSubmit,
  isPending,
  isEdit = false,
  currentPrice,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {isEdit && (
        <TextField
          label="ราคาปัจจุบัน"
          name="current_price"
          includeRegister={register}
          disabled={true}
        />
      )}
      <TextField
        label="ราคาที่ต้องการ"
        name="new_price"
        type="number"
        includeRegister={register}
        error={
          typeof errors.new_price?.message === 'string'
            ? errors.new_price.message
            : ''
        }
      />
      <div className="flex justify-end">
        <Button
          type="button"
          className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          onClick={onSubmit}
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </div>
        </Button>
      </div>
    </div>
  );
};
