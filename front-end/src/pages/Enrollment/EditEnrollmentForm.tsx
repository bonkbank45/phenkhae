import React from 'react';
import { StudentCourseDataTable } from '../../types/enrollment';
import { useForm } from 'react-hook-form';
import { useEditEnrollment } from '../../hooks/api/useEnrollmentData';
import TextField from '../../components/Forms/TextField';
import DatePickerWithController from '../../components/Forms/DatePicker/DatePickerWithController';
import DropdownSearchWithController from '../../components/Forms/DropdownSearchWithController';
import { Button } from '@material-tailwind/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse } from '../../types/error_response';
import { enrollmentStudentEditSchema } from '../../schema/enrollment/enrollmentStudentEdit';
interface EditEnrollmentFormProps {
  enrollment: StudentCourseDataTable;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}

const EditEnrollmentForm = ({
  enrollment,
  onSuccess,
  onError,
}: EditEnrollmentFormProps) => {
  const { mutate: editEnrollment, isPending: isEditEnrollmentPending } =
    useEditEnrollment();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      course_group_id: enrollment.course_group_id,
      student_id: enrollment.student_id,
      student_name: enrollment.student_name,
      course_name: enrollment.course_name,
      batch_name: enrollment.batch_name,
      enrollment_date: enrollment.enrollment_date,
      date_start: enrollment.student_start_date,
      date_end: enrollment.student_end_date,
      activity_case_status: enrollment.case_status === 'ยังไม่ส่งเคส' ? 0 : 1,
      theoretical_score: enrollment.theoretical_score,
      practical_score: enrollment.practical_score,
    },
    resolver: yupResolver(enrollmentStudentEditSchema),
  });

  const onSubmit = (data) => {
    editEnrollment(
      {
        course_group_id: enrollment.course_group_id,
        student_id: enrollment.student_id,
        activity_case_status: data.activity_case_status,
        enrollment_date: data.enrollment_date,
        date_start: data.date_start,
        theoretical_score: data.theoretical_score,
        practical_score: data.practical_score,
      },
      {
        onSuccess: () => {
          console.log('edit enrollment success');
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          console.log('edit enrollment error', error);
          onError(error);
        },
      },
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="ไอดีรุ่นหลักสูตร"
        name="course_group_id"
        includeRegister={register}
        disabled={true}
      />
      <TextField
        label="ไอดีนักเรียน"
        name="student_id"
        includeRegister={register}
        disabled={true}
      />
      <TextField
        label="ชื่อนักเรียน"
        name="student_name"
        includeRegister={register}
        disabled={true}
      />
      <TextField
        label="ชื่อหลักสูตร"
        name="course_name"
        includeRegister={register}
        disabled={true}
      />
      <TextField
        label="รุ่นหลักสูตร"
        name="batch_name"
        includeRegister={register}
        disabled={true}
      />
      <DropdownSearchWithController
        label="สถานะการส่งเคส"
        name="activity_case_status"
        options={[
          { label: 'ยังไม่ส่งเคส', value: 0 },
          { label: 'ส่งเคสแล้ว', value: 1 },
        ]}
        required={true}
        control={control}
      />
      <DatePickerWithController
        label="วันที่ลงทะเบียน"
        name="enrollment_date"
        placeholder="วันที่ลงทะเบียน"
        control={control}
        required={true}
      />
      <DatePickerWithController
        label="วันที่เริ่มเรียน"
        name="date_start"
        placeholder="วันที่เริ่มเรียน"
        control={control}
        required={true}
      />
      <TextField
        label="คะแนนทฤษฎีที่ได้ (คะแนนตัดสินการจบหลักสูตร)"
        name="theoretical_score"
        type="number"
        placeholder={
          enrollment.theoretical_score === null
            ? '(ยังไม่ได้ระบุ)'
            : 'คะแนนทฤษฎีที่ได้'
        }
        includeRegister={register}
        error={
          typeof errors.theoretical_score?.message === 'string'
            ? errors.theoretical_score?.message
            : ''
        }
      />
      <TextField
        label="คะแนนปฏิบัติที่ได้ (คะแนนตัดสินการจบหลักสูตร)"
        name="practical_score"
        type="number"
        placeholder={
          enrollment.practical_score === null
            ? '(ยังไม่ได้ระบุ)'
            : 'คะแนนปฏิบัติที่ได้'
        }
        includeRegister={register}
        error={
          typeof errors.practical_score?.message === 'string'
            ? errors.practical_score?.message
            : ''
        }
      />
      <div className="flex justify-end">
        <Button
          type="button"
          className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          onClick={handleSubmit(onSubmit)}
          disabled={isEditEnrollmentPending}
        >
          <div className="flex items-center gap-2">
            {isEditEnrollmentPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default EditEnrollmentForm;
