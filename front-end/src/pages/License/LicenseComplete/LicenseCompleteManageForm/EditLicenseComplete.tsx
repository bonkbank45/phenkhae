import React, { useEffect } from 'react';
import DatePickerWithController from '../../../../components/Forms/DatePicker/DatePickerWithController';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateLicenseComplete } from '../../../../hooks/api/useLicenseComplete';
import { ErrorResponse } from '../../../../types/error_response';

export interface UpdateLicenseCompleteStudentProps {
  id: number;
  student_id: number;
  course_id: number;
  date_complete: string;
  firstname_tha: string;
  lastname_tha: string;
  course_name: string;
}

const EditLicenseComplete = ({
  selectedLicenseCompleteStudent,
  onSuccess,
  onError,
}: {
  selectedLicenseCompleteStudent: UpdateLicenseCompleteStudentProps;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const {
    mutate: updateLicenseComplete,
    isPending: isPendingUpdateLicenseComplete,
  } = useUpdateLicenseComplete();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      date: '',
    },
    resolver: yupResolver(
      yup.object().shape({
        date: yup.string().required('กรุณาเลือกวันที่ได้รับใบประกอบวิชาชีพ'),
      }),
    ),
  });

  useEffect(() => {
    if (selectedLicenseCompleteStudent.date_complete) {
      reset({
        date: format(
          new Date(selectedLicenseCompleteStudent.date_complete),
          'dd/MM/yyyy',
        ),
      });
    }
  }, [selectedLicenseCompleteStudent, reset]);

  const onSubmit = (data: { date: string }) => {
    const licenseComplete = {
      id: selectedLicenseCompleteStudent.id,
      student_id: selectedLicenseCompleteStudent.student_id,
      course_id: selectedLicenseCompleteStudent.course_id,
      date_complete: data.date,
    };

    updateLicenseComplete(licenseComplete, {
      onSuccess: () => {
        console.log('success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.error(error);
        onError(error);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 font-notoLoopThaiRegular">
      <div>
        ชื่อ {selectedLicenseCompleteStudent.firstname_tha}{' '}
        {selectedLicenseCompleteStudent.lastname_tha}
      </div>
      <div>หลักสูตร {selectedLicenseCompleteStudent.course_name}</div>
      <div>
        <DatePickerWithController
          name="date"
          label="วันที่ได้รับใบประกอบวิชาชีพ"
          control={control}
          placeholder="วันที่ได้รับใบประกอบวิชาชีพ"
          error={
            typeof errors.date?.message === 'string' ? errors.date?.message : ''
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="blue"
          className="py-3"
          disabled={isPendingUpdateLicenseComplete}
          loading={isPendingUpdateLicenseComplete}
          onClick={handleSubmit(onSubmit)}
        >
          ยืนยัน
        </Button>
      </div>
    </div>
  );
};

export default EditLicenseComplete;
