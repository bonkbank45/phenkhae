import React from 'react';
import { useForm } from 'react-hook-form';
import DatePickerWithController from '../../../../components/Forms/DatePicker/DatePickerWithController';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddBulkLicenseQual } from '../../../../hooks/api/useLicenseQual';
import { ErrorResponse } from '../../../../types/error_response';
import { CourseCompletion } from '../../../../types/course_completion';

export const AddStudentsToQualForm = ({
  students,
  onSuccess,
  onError,
}: {
  students: CourseCompletion[];
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
        date_qualified: yup.string().required('กรุณาเลือกวันที่'),
      }),
    ),
  });
  const { mutate: addBulkLicenseQual, isPending: isLoadingAddBulkLicenseQual } =
    useAddBulkLicenseQual();

  const onSubmit = async (data: { date_qualified: string }) => {
    const formattedData = {
      date_qualified: data.date_qualified,
      students: students.map((completion) => ({
        student_id: completion.student.id,
        course_group_id: completion.course_group_id,
      })),
    };

    console.log(formattedData);

    addBulkLicenseQual(formattedData, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error) => {
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
          {students.map((completion, index) => (
            <p key={completion.id} className="font-notoLoopThaiRegular text-sm">
              {index + 1}. {completion.student.firstname_tha}{' '}
              {completion.student.lastname_tha}{' '}
              {'หลักสูตร: ' + completion.course_group.course.course_name}{' '}
              {'รุ่นที่: ' + completion.course_group.batch}
            </p>
          ))}
        </div>
      </div>

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
          disabled={isLoadingAddBulkLicenseQual}
          loading={isLoadingAddBulkLicenseQual}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};
