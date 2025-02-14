import React from 'react';
import { useForm } from 'react-hook-form';
import DropdownSearchWithController from '../../../components/Forms/DropdownSearchWithController';
import DatePickerWithController from '../../../components/Forms/DatePicker/DatePickerWithController';
import { useCourseLicenseAvailable } from '../../../hooks/api/useCourseData';
import { Student } from '../../../types/student';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddLicenseQual } from '../../../hooks/api/useLicenseQual';
import { ErrorResponse } from '../../../types/error_response';

export const AddStudentToQualForm = ({
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
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        course_id: yup.string().required('กรุณาเลือกหลักสูตร'),
        date_qualified: yup.string().required('กรุณาเลือกวันที่'),
      }),
    ),
  });
  const { data: courses, isLoading: isLoadingCourses } =
    useCourseLicenseAvailable();
  const { mutate: addLicenseQual, isPending: isLoadingAddLicenseQual } =
    useAddLicenseQual();

  if (isLoadingCourses) return <div>Loading...</div>;

  const onSubmit = (data: any) => {
    addLicenseQual(
      { ...data, student_id: student.id },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          onError(error);
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
        label="วันที่มีสิทธิสอบ"
        name="date_qualified"
        placeholder="วันที่สอบ"
        control={control}
        required={true}
        error={
          typeof errors.date_qualified?.message === 'string'
            ? errors.date_qualified?.message
            : ''
        }
      />
      <div className="flex justify-end">
        <Button
          color="blue"
          className="font-notoLoopThaiRegular"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoadingAddLicenseQual}
          loading={isLoadingAddLicenseQual}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};
