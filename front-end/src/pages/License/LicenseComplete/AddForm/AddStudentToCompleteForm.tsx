import React from 'react';
import { useForm } from 'react-hook-form';
import DropdownSearchWithController from '../../../../components/Forms/DropdownSearchWithController';
import DatePickerWithController from '../../../../components/Forms/DatePicker/DatePickerWithController';
import { useCourseLicenseAvailable } from '../../../../hooks/api/useCourseData';
import { Student } from '../../../../types/student';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse } from '../../../../types/error_response';
import { useAddLicenseComplete } from '../../../../hooks/api/useLicenseComplete';

export const AddStudentToCompleteForm = ({
  student,
  onSuccess,
  onError,
}: {
  student: Student;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        course_id: yup.string().required('กรุณาเลือกหลักสูตร'),
        date_complete: yup.string().required('กรุณาเลือกวันที่'),
      }),
    ),
  });
  const { data: courses, isLoading: isLoadingCourses } =
    useCourseLicenseAvailable();

  const { mutate: addLicenseComplete, isPending: isLoadingAddLicenseComplete } =
    useAddLicenseComplete();

  const onSubmit = (data: any) => {
    console.log(data);
    addLicenseComplete(
      { ...data, student_id: student.id },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          onError(error);
          setError('course_id', {
            type: 'server',
            message:
              error.response?.data?.message ||
              'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold font-notoLoopThaiRegular">
        {student.firstname_tha + ' ' + student.lastname_tha}
      </p>
      <DropdownSearchWithController
        label="หลักสูตร (เฉพาะหลักสูตรที่ 7 ถึง 10)"
        name="course_id"
        placeholder="หลักสูตร"
        control={control}
        required={true}
        options={courses?.data.map((course) => ({
          label: course.course_name,
          value: course.id,
        }))}
        error={
          typeof errors.course_id?.message === 'string'
            ? errors.course_id?.message
            : ''
        }
      />
      <DatePickerWithController
        label="วันที่ได้รับใบประกอบวิชาชีพ"
        name="date_complete"
        placeholder="วันที่ได้รับใบประกอบวิชาชีพ"
        control={control}
        required={true}
        error={
          typeof errors.date_complete?.message === 'string'
            ? errors.date_complete?.message
            : ''
        }
      />
      <div className="flex justify-end">
        <Button
          color="blue"
          className="font-notoLoopThaiRegular"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoadingAddLicenseComplete}
          loading={isLoadingAddLicenseComplete}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};
