import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, Spinner } from '@material-tailwind/react';
import { CourseCompletion } from '../../../types/course_completion';
import DatePickerWithController from '../../../components/Forms/DatePicker/DatePickerWithController';
import { format } from 'date-fns';
import DropdownSearchWithController from '../../../components/Forms/DropdownSearchWithController';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseGraduateFormSchema } from '../../../schema/courses/courseGraduateForm';
import { useUpdateCourseCompletion } from '../../../hooks/api/useCourseCompletion';
import { ErrorResponse } from '../../../types/error_response';

interface EditCourseGraduateFormProps {
  initialData?: CourseCompletion;
  isLoading?: boolean;
  onSuccess?: () => void;
}

const EditCourseGraduateForm = ({
  initialData,
  isLoading = false,
  onSuccess,
}: EditCourseGraduateFormProps) => {
  const {
    mutate: updateCourseCompletion,
    isPending: isUpdateCourseCompletionPending,
  } = useUpdateCourseCompletion();

  const methods = useForm<CourseCompletion>({
    defaultValues: {
      certificate_status: initialData?.certificate_status,
      certificate_date:
        initialData?.certificate_status === 1
          ? initialData?.certificate_date
          : null,
    },
    resolver: yupResolver(courseGraduateFormSchema),
  });

  const certificateStatus = methods.watch('certificate_status');

  useEffect(() => {
    if (certificateStatus === 0) {
      methods.setValue('certificate_date', null);
    }
  }, [certificateStatus, methods]);

  const handleSubmitForm = async (data: CourseCompletion) => {
    updateCourseCompletion(
      {
        ...data,
        id: initialData?.id,
      },
      {
        onSuccess: () => {
          console.log('Update course completion completed');
          onSuccess?.();
        },
        onError: (error: ErrorResponse) => {
          console.error(error);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form
        onSubmit={methods.handleSubmit(handleSubmitForm)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <span className="col-span-2 font-notoLoopThaiRegular">
            ชื่อผู้จบหลักสูตร{' '}
            {initialData?.student.firstname_tha +
              ' ' +
              initialData?.student.lastname_tha}
          </span>

          <span className="font-notoLoopThaiRegular">
            หลักสูตรที่จบ {initialData?.course_group.course.course_name}
          </span>

          <span className="font-notoLoopThaiRegular">
            รุ่นที่ {initialData?.course_group.batch}
          </span>
        </div>

        <DatePickerWithController
          name="date_start"
          label="วันที่เริ่มเรียน"
          placeholder="วันที่เริ่มเรียน"
          required={true}
          control={methods.control}
          value={initialData?.date_start}
          error={methods.formState.errors.date_start?.message}
        />

        <DatePickerWithController
          name="date_end"
          label="วันสุดท้ายของการเรียน"
          placeholder="วันสุดท้ายของการเรียน"
          required={true}
          control={methods.control}
          value={initialData?.date_end}
          error={methods.formState.errors.date_end?.message}
        />

        <DatePickerWithController
          name="completion_date"
          label="วันที่สำเร็จการศึกษา"
          placeholder="วันที่สำเร็จการศึกษา"
          required={true}
          control={methods.control}
          value={initialData?.completion_date}
          error={methods.formState.errors.completion_date?.message}
        />

        <DropdownSearchWithController
          name="certificate_status"
          label="สถานะการมารับใบประกาศนียบัตร"
          placeholder="สถานะการมารับใบประกาศนียบัตร"
          options={[
            { label: 'ยังไม่มารับใบประกาศนียบัตร', value: 0 },
            { label: 'รับใบประกาศนียบัตรแล้ว', value: 1 },
          ]}
          control={methods.control}
          required={true}
          error={methods.formState.errors.certificate_status?.message}
        />

        <DatePickerWithController
          name="certificate_date"
          label="วันที่รับใบประกาศนียบัตร"
          placeholder="วันที่รับใบประกาศนียบัตร"
          required={certificateStatus === 1}
          control={methods.control}
          disabled={certificateStatus === 0}
          value={initialData?.certificate_date}
          error={methods.formState.errors.certificate_date?.message}
        />

        <Button
          type="submit"
          disabled={isUpdateCourseCompletionPending}
          loading={isUpdateCourseCompletionPending}
          className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          <div className="flex items-center gap-2">
            {isLoading && <Spinner className="w-4 h-4" color="blue" />}
            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
          </div>
        </Button>
      </form>
    </div>
  );
};

export default EditCourseGraduateForm;
