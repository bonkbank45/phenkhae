import React, { useEffect, useState } from 'react';
import TextField from '../../../components/Forms/TextField';
import DatePickerWithController from '../../../components/Forms/DatePicker/DatePickerWithController';
import Button from '@material-tailwind/react/components/Button';
import { useForm } from 'react-hook-form';
import {
  useAddBillData,
  useGetLatestBillVolData,
  useUpdateBillData,
} from '../../../hooks/api/useBillData';
import Spinner from '../../../common/Spinner';
import { BillInfoForm } from '../../../types/bill_info';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { addBillInfoSchema } from '../../../schema/billInfo/addBillInfo';
import { ErrorResponse } from '../../../types/error_response';

const CourseBatchBillAdd = ({
  onSuccess,
  onError,
  courseGroupId,
  studentId,
}: {
  onSuccess: () => void;
  onError: (error: string) => void;
  courseGroupId: number;
  studentId: number;
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addBillInfoSchema),
  });
  const { data: latestBillVolData, isLoading: isLatestBillVolDataLoading } =
    useGetLatestBillVolData();

  console.log(latestBillVolData);

  const { mutate: addBillData, isPending: isAddBillDataPending } =
    useAddBillData();

  useEffect(() => {
    if (latestBillVolData && !isLatestBillVolDataLoading) {
      setValue('bill_infos_vol', latestBillVolData.data.vol);
      setValue('bill_infos_no', latestBillVolData.data.no + 1);
    }
  }, [latestBillVolData, isLatestBillVolDataLoading]);

  const onSubmitForm = (data: BillInfoForm) => {
    console.log({
      ...data,
      course_group_id: courseGroupId,
      student_id: studentId,
    });
    addBillData(
      { ...data, course_group_id: courseGroupId, student_id: studentId },
      {
        onSuccess: () => {
          console.log('success');
          reset();
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          let errorMessages = '';
          if (error.response.data.errors) {
            console.error(error);
            errorMessages = Object.entries(error.response.data.errors)
              .map(([_, value]) => value[0])
              .join(', ');
          } else if (error.response.data.message.includes('Duplicate entry')) {
            const duplicateMessage =
              'เลขที่บิลนี้ถูกใช้งานแล้ว กรุณาตรวจสอบเลข Vol และ No อีกครั้ง';
            setError('bill_infos_vol', {
              type: 'manual',
              message: duplicateMessage,
            });
            setError('bill_infos_no', {
              type: 'manual',
              message: duplicateMessage,
            });
            errorMessages = duplicateMessage;
          } else {
            console.error(error);
            errorMessages = error.response.data.message;
          }
          onError(errorMessages);
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        {isLatestBillVolDataLoading && (
          <div className="flex items-center gap-2">
            <Spinner className="!w-4 !h-4" />
            <span className="text-sm text-gray-500 font-notoLoopThaiRegular">
              กำลังดึงข้อมูล... vol, no สูงสุด จากฐานข้อมูล
            </span>
          </div>
        )}
        <TextField
          label="Vol"
          name="bill_infos_vol"
          placeholder="ตัวอย่าง: 1"
          includeRegister={register}
          error={errors.bill_infos_vol?.message as string}
        />
        <TextField
          label="No"
          name="bill_infos_no"
          placeholder="ตัวอย่าง: 1"
          required={true}
          includeRegister={register}
          error={errors.bill_infos_no?.message as string}
        />
        <TextField
          label="ผู้รับเงิน"
          name="bill_infos_receiver"
          placeholder="ชื่อผู้รับเงิน"
          required={true}
          includeRegister={register}
          error={errors.bill_infos_receiver?.message as string}
        />
        <TextField
          label="หมายเหตุ"
          name="bill_infos_note"
          placeholder="หมายเหตุ"
          required={false}
          includeRegister={register}
          error={errors.bill_infos_note?.message as string}
        />
        <DatePickerWithController
          label="วันที่จ่ายเงิน"
          name="bill_infos_date"
          placeholder="วัน/เดือน/ปี"
          required={true}
          control={control}
          error={errors.bill_infos_date?.message as string}
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="blue"
          disabled={isAddBillDataPending}
          onClick={handleSubmit(onSubmitForm)}
        >
          {isAddBillDataPending ? 'กำลังบันทึก...' : 'บันทึก'}
        </Button>
      </div>
    </>
  );
};

export default CourseBatchBillAdd;
