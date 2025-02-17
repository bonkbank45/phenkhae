import React from 'react';
import { useForm } from 'react-hook-form';
import DatePickerWithController from '../../../../components/Forms/DatePicker/DatePickerWithController';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddBulkLicenseComplete } from '../../../../hooks/api/useLicenseComplete';
import { ErrorResponse } from '../../../../types/error_response';
import { LicenseQualAddTableInterface } from '../../../../types/license_qual';

export const AddStudentsToCompleteForm = ({
  students,
  onSuccess,
  onError,
}: {
  students: LicenseQualAddTableInterface[];
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        date_completed: yup.string().required('กรุณาเลือกวันที่'),
      }),
    ),
  });

  const {
    mutate: addBulkLicenseComplete,
    isPending: isLoadingAddBulkLicenseComplete,
  } = useAddBulkLicenseComplete();

  const onSubmit = async (data: { date_completed: string }) => {
    const formattedData = {
      date_completed: data.date_completed,
      students: students.map((qual) => ({
        student_id: qual.student.id,
        course_id: qual.course_id,
      })),
    };

    addBulkLicenseComplete(formattedData, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        onError(error);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-lg font-bold font-notoLoopThaiRegular mb-2">
          รายชื่อนักเรียนที่เลือก ({students.length} คน)
        </p>
        <div className="max-h-40 overflow-y-auto">
          {students.map((qual, index) => (
            <p key={qual.id} className="font-notoLoopThaiRegular text-sm">
              {index + 1}. {qual.student.firstname_tha}{' '}
              {qual.student.lastname_tha}
            </p>
          ))}
        </div>
      </div>

      <DatePickerWithController
        label="วันที่สอบผ่าน"
        name="date_completed"
        placeholder="วันที่สอบผ่าน"
        control={control}
        required={true}
        error={
          typeof errors.date_completed?.message === 'string'
            ? errors.date_completed?.message
            : ''
        }
      />

      <div className="flex justify-end">
        <Button
          color="blue"
          className="font-notoLoopThaiRegular"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoadingAddBulkLicenseComplete}
          loading={isLoadingAddBulkLicenseComplete}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};

export default AddStudentsToCompleteForm;
