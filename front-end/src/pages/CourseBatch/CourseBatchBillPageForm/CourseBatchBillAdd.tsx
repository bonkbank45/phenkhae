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
import TextArea from '../../../components/Forms/TextArea';
import { useEnrollmentStudentStatusByCourseGroupIdAll } from '../../../hooks/api/useEnrollmentData';
import DropdownSearchWithController from '../../../components/Forms/DropdownSearchWithController';

const CourseBatchBillAdd = ({
  onSuccess,
  onError,
  courseGroupId,
  studentId,
  isManual = false,
}: {
  onSuccess: () => void;
  onError: (error: string) => void;
  courseGroupId: number;
  studentId?: number;
  isManual?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addBillInfoSchema),
  });
  const { data: latestBillVolData, isLoading: isLatestBillVolDataLoading } =
    useGetLatestBillVolData();

  const { mutate: addBillData, isPending: isAddBillDataPending } =
    useAddBillData();

  useEffect(() => {
    if (latestBillVolData && !isLatestBillVolDataLoading) {
      setValue('bill_infos_vol', latestBillVolData.data.vol);
      setValue('bill_infos_no', latestBillVolData.data.no + 1);
    }
  }, [latestBillVolData, isLatestBillVolDataLoading]);

  const { data: enrollmentData, isLoading: isEnrollmentDataLoading } =
    useEnrollmentStudentStatusByCourseGroupIdAll(courseGroupId);

  const formattedStudentList = enrollmentData?.data.map((enrollment) => ({
    value: enrollment.student_id,
    label:
      enrollment.student.firstname_tha + ' ' + enrollment.student.lastname_tha,
  }));

  const onSubmitForm = (data: BillInfoForm) => {
    let selectedStudentId = studentId;

    if (isManual) {
      selectedStudentId = watch('student_id');
    }

    console.log({
      ...data,
      course_group_id: courseGroupId,
      student_id: selectedStudentId,
    });

    addBillData(
      {
        ...data,
        course_group_id: courseGroupId,
        student_id: selectedStudentId,
      },
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
          }
          if (error.response.data.message.includes('Duplicate entry')) {
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
          } if (error.response.data.errors?.student_id) {
            const studentIdMessage =
              'กรุณาเลือกนักเรียนจากรายชื่อนักเรียนที่สมัครเรียนในคอร์สนี้';
            setError('student_id', {
              type: 'manual',
              message: studentIdMessage,
            });
            errorMessages = studentIdMessage;
          } else {
            console.error(error);
            errorMessages = error.response.data.message;
          }
          onError(errorMessages);
        },
      },
    );
  };

  console.log(formattedStudentList);

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        {isLatestBillVolDataLoading ||
          (isEnrollmentDataLoading && (
            <div className="flex items-center gap-2">
              <Spinner className="!w-4 !h-4" />
              <span className="text-sm text-gray-500 font-notoLoopThaiRegular">
                กำลังดึงข้อมูล... vol, no สูงสุด จากฐานข้อมูล
              </span>
            </div>
          ))}
        {isManual && (
          <DropdownSearchWithController
            label="นักเรียน"
            name="student_id"
            options={formattedStudentList}
            control={control}
            error={errors.student_id?.message as string}
          />
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
        <TextArea
          name="bill_infos_note"
          label="หมายเหตุ"
          placeholder="หมายเหตุ"
          maxLength={60}
          required={false}
          control={control}
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
