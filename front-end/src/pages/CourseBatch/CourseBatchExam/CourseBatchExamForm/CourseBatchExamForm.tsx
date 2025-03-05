import React, { useEffect } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import TextField from '../../../../components/Forms/TextField';
import DropdownSearchWithController from '../../../../components/Forms/DropdownSearchWithController';
import { useExamTypeData } from '../../../../hooks/api/useExamTypeData';
import { Button } from '@material-tailwind/react';
import DatePickerWithController from '../../../../components/Forms/DatePicker/DatePickerWithController';
import { addExamSchema } from '../../../../schema/exam/addExam';
import { yupResolver } from '@hookform/resolvers/yup';
import { ExamTable } from '../../../../types/exam';
import { ErrorResponse } from '../../../../types/error_response';

interface CourseBatchExamFormProps {
  defaultValues?: ExamTable;
  onSubmit: (data: ExamTable, setError: UseFormSetError<ExamTable>) => void;
  isLoading?: boolean;
  buttonText: string;
  onError?: (error: ErrorResponse, setError: any) => void;
}

const CourseBatchExamForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  buttonText,
}: CourseBatchExamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<ExamTable>({
    resolver: yupResolver(addExamSchema),
    defaultValues,
  });

  const { data: examTypeData, isLoading: examTypeLoading } = useExamTypeData();

  const handleFormSubmit = (data: ExamTable) => {
    onSubmit(data, setError);
  };

  if (examTypeLoading)
    return (
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-500 font-notoLoopThaiRegular">
          กำลังโหลดข้อมูล...
        </span>
      </div>
    );

  return (
    <div className="p-4 flex flex-col gap-4">
      <TextField
        label="ปี"
        name="year"
        placeholder="1"
        includeRegister={register}
        error={errors.year?.message as string}
        required={true}
      />
      <TextField
        label="เทอม"
        name="term"
        placeholder="1"
        includeRegister={register}
        error={errors.term?.message as string}
        required={true}
      />
      <DropdownSearchWithController
        label="ประเภทการสอบ"
        name="exam_type_id"
        placeholder="เลือกประเภทการสอบ"
        control={control}
        error={errors.exam_type_id?.message as string}
        required={true}
        options={examTypeData?.data.map((examType) => ({
          value: examType.id,
          label: examType.exam_type_name,
        }))}
      />
      <DropdownSearchWithController
        label="การสอบ"
        name="exam_period"
        placeholder="กลางภาค"
        control={control}
        error={errors.exam_period?.message as string}
        required={true}
        options={[
          { label: 'กลางภาค', value: 1 },
          { label: 'ปลายภาค', value: 2 },
          { label: 'เพิ่มเติม', value: 3 },
        ]}
      />
      <TextField
        label="คะแนนผ่าน"
        name="score_pass"
        placeholder="50"
        includeRegister={register}
        error={errors.score_pass?.message as string}
        required={true}
      />
      <DatePickerWithController
        label="วันที่เริ่มการสอบ"
        name="date_start_exam"
        placeholder="วันที่เริ่มการสอบ"
        control={control}
        error={errors.date_start_exam?.message as string}
        required={true}
      />
      <div className="flex justify-end">
        <Button
          color="blue"
          className="py-3 font-notoLoopThaiRegular"
          disabled={isLoading}
          loading={isLoading}
          onClick={handleSubmit(handleFormSubmit)}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CourseBatchExamForm;
