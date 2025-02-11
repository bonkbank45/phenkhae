import React from 'react';
import DatePickerWithController from '../../../components/Forms/DatePicker/DatePickerWithController';
import { useForm } from 'react-hook-form';
import { GraduateStudent } from '../../../types/graduate';
import { format, parse } from 'date-fns';
import Button from '@material-tailwind/react/components/Button';
import { useCourseCompletion } from '../../../hooks/api/useCourseCompletion';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import * as yup from 'yup';

const ConfirmGraduateForm = ({
  graduateData,
  onSuccess,
  onError,
}: {
  graduateData: GraduateStudent;
  onSuccess: () => void;
  onError: () => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      completion_date: new Date(),
    },
    resolver: yupResolver(
      yup.object({
        completion_date: yup
          .string()
          .required('กรุณาเลือกวันที่จบการศึกษา')
          .test(
            'is-after-start-date',
            'วันที่จบการศึกษาต้องไม่น้อยกว่าวันที่เริ่มเรียน',
            function (value) {
              if (!value) return false;
              const completionDate = parse(value, 'dd/MM/yyyy', new Date());
              const startDate = new Date(graduateData.course_group.date_start);

              return completionDate >= startDate;
            },
          ),
      }),
    ),
  });
  const { mutate: courseCompletionMutation, isPending: isLoading } =
    useCourseCompletion();

  const handleConfirmGraduate = (formData: any) => {
    courseCompletionMutation(
      {
        course_group_id: graduateData.course_group.course_group_id,
        student_id: graduateData.enrollment.student_id,
        completion_date: formData.completion_date,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: () => {
          onError();
        },
      },
    );
  };

  return (
    <div className="p-4 font-notoLoopThaiRegular">
      <h1 className="text-xl font-bold mb-4">ข้อมูลการจบการศึกษา</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="font-semibold mb-2">ข้อมูลหลักสูตร</h2>
          <div className="space-y-2">
            <p>ชื่อหลักสูตร: {graduateData.course_name}</p>
            <p>รุ่นที่: {graduateData.course_group.batch}</p>
            <p>
              วันที่เริ่ม:{' '}
              {format(
                new Date(graduateData.course_group.date_start),
                'dd/MM/yyyy',
              )}
            </p>
            <p>
              วันที่สิ้นสุด:{' '}
              {format(
                new Date(graduateData.course_group.date_end),
                'dd/MM/yyyy',
              )}
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">ข้อมูลนักเรียน</h2>
          <div className="space-y-2">
            <p>
              ชื่อ-นามสกุล: {graduateData.enrollment.firstname_tha}{' '}
              {graduateData.enrollment.lastname_tha}
            </p>
            <p>
              คะแนนภาคทฤษฎี: {graduateData.enrollment.theoretical_score}/
              {graduateData.course_group.theoretical_score_criteria}
            </p>
            <p>
              คะแนนภาคปฏิบัติ: {graduateData.enrollment.practical_score}/
              {graduateData.course_group.practical_score_criteria}
            </p>
            <p>
              การเข้าเรียน: {graduateData.student_attendance.present_count}/
              {graduateData.student_attendance.total_classes} ครั้ง
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">ข้อมูลการชำระเงิน</h2>
        <div className="space-y-2">
          <p>เล่มที่: {graduateData.bill_infos.vol}</p>
          <p>เลขที่: {graduateData.bill_infos.no}</p>
          <p>
            ประเภทบิล: {graduateData.course_category.course_category_bill_name}
          </p>
          <p>
            วันที่ชำระ:{' '}
            {format(
              new Date(graduateData.bill_infos.date_submit),
              'dd/MM/yyyy',
            )}
          </p>
          <p>
            ค่าเล่าเรียน:{' '}
            {Number(graduateData.bill_infos.course_price).toLocaleString()} บาท
          </p>
        </div>
      </div>

      <DatePickerWithController
        label="ยืนยันวันที่จบการศึกษา"
        name="completion_date"
        control={control}
        placeholder="ยืนยันวันที่จบการศึกษา"
        error={errors.completion_date?.message}
      />

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit(handleConfirmGraduate)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={isLoading}
          loading={isLoading}
        >
          ยืนยันการจบการศึกษา
        </Button>
      </div>
    </div>
  );
};

export default ConfirmGraduateForm;
