import React from 'react';
import {
  BillInfoForm,
  SelectedStudentBillInfo,
} from '../../../types/bill_info';
import TextField from '../../../components/Forms/TextField';
import DatePickerWithController from '../../../components/Forms/DatePicker/DatePickerWithController';
import { Button } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { useUpdateBillData } from '../../../hooks/api/useBillData';
import { ErrorResponse } from '../../../types/error_response';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { editBillInfoSchema } from '../../../schema/billInfo/editBillInfo';
import { format } from 'date-fns';

const CourseBatchBillEdit = ({
  onSuccess,
  onError,
  studentBillInfo,
}: {
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  studentBillInfo: SelectedStudentBillInfo;
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BillInfoForm>({
    resolver: yupResolver(editBillInfoSchema),
    defaultValues: {
      ...studentBillInfo,
      bill_infos_date: studentBillInfo.bill_infos_date
        ? format(studentBillInfo.bill_infos_date, 'dd/MM/yyyy')
        : '',
    },
  });

  const { mutate: updateBillData, isPending: isUpdateBillDataPending } =
    useUpdateBillData();

  const onSubmitForm = (data: BillInfoForm) => {
    console.log(data);
    updateBillData(data, {
      onSuccess: () => {
        console.log('success');
        reset();
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.log('error', error);
        onError(error);
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2 font-notoLoopThaiRegular">
          <span>Vol. (เล่มที่)</span>
          <span className="font-bold">{studentBillInfo.bill_infos_vol}</span>
          <span>No. (เลขที่)</span>
          <span className="font-bold">{studentBillInfo.bill_infos_no}</span>
        </div>
        <TextField
          label="ผู้รับเงิน"
          name="bill_infos_receiver"
          placeholder="ชื่อผู้รับเงิน"
          includeRegister={register}
          defaultValue={studentBillInfo.bill_infos_receiver}
          error={errors.bill_infos_receiver?.message as string}
        />
        <DatePickerWithController
          label="วันที่จ่ายเงิน"
          name="bill_infos_date"
          placeholder="วัน/เดือน/ปี"
          control={control}
          value={studentBillInfo.bill_infos_date}
          error={errors.bill_infos_date?.message as string}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          color="blue"
          className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isUpdateBillDataPending}
          onClick={handleSubmit(onSubmitForm)}
        >
          {isUpdateBillDataPending ? 'กำลังบันทึก...' : 'บันทึก'}
        </Button>
      </div>
    </>
  );
};

export default CourseBatchBillEdit;
