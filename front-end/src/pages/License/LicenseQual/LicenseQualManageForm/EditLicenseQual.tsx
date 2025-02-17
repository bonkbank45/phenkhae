import React, { useEffect } from 'react';
import DatePickerWithController from '../../../../components/Forms/DatePicker/DatePickerWithController';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateLicenseQual } from '../../../../hooks/api/useLicenseQual';
import { ErrorResponse } from '../../../../types/error_response';

export interface UpdateLicenseQualStudentProps {
  id: number;
  student_id: number;
  course_id: number;
  date_qualified: string;
  firstname_tha: string;
  lastname_tha: string;
  course_name: string;
}

const EditLicenseQual = ({
  selectedLicenseQualStudent,
  onSuccess,
  onError,
}: {
  selectedLicenseQualStudent: UpdateLicenseQualStudentProps;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const { mutate: updateLicenseQual, isPending: isPendingUpdateLicenseQual } =
    useUpdateLicenseQual();

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
        date: yup
          .string()
          .required('กรุณาเลือกวันที่มีสิทธิการสอบใบประกอบวิชาชีพ'),
      }),
    ),
  });

  useEffect(() => {
    if (selectedLicenseQualStudent.date_qualified) {
      reset({
        date: format(
          new Date(selectedLicenseQualStudent.date_qualified),
          'dd/MM/yyyy',
        ),
      });
    }
  }, [selectedLicenseQualStudent, reset]);

  const onSubmit = (data: { date: string }) => {
    const licenseQual = {
      id: selectedLicenseQualStudent.id,
      student_id: selectedLicenseQualStudent.student_id,
      course_id: selectedLicenseQualStudent.course_id,
      date_qualified: data.date,
    };

    updateLicenseQual(licenseQual, {
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
        ชื่อ {selectedLicenseQualStudent.firstname_tha}{' '}
        {selectedLicenseQualStudent.lastname_tha}
      </div>
      <div>หลักสูตร {selectedLicenseQualStudent.course_name}</div>
      <div>
        <DatePickerWithController
          name="date"
          label="วันที่มีสิทธิการสอบใบประกอบวิชาชีพ"
          control={control}
          placeholder="วันที่มีสิทธิการสอบใบประกอบวิชาชีพ"
          error={
            typeof errors.date?.message === 'string' ? errors.date?.message : ''
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="blue"
          className="py-3"
          disabled={isPendingUpdateLicenseQual}
          loading={isPendingUpdateLicenseQual}
          onClick={handleSubmit(onSubmit)}
        >
          ยืนยัน
        </Button>
      </div>
    </div>
  );
};

export default EditLicenseQual;
