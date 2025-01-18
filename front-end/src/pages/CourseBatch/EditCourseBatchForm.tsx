import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Spinner } from '@material-tailwind/react';
import TextField from '../../components/Forms/TextField';
import { CourseGroup } from '../../types/course_group';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDateToThai, formatDateToString } from '../../utils/datetime';
import { editBatchSchema } from '../../schema/ฺbatchs/editBatch/editBatch';
import DatePickerWithController from '../../components/Forms/DatePicker/DatePickerWithController';

const EditCourseBatchForm = ({
  initialData,
  onClose,
  handleSubmitEditForm,
  isPending,
}: {
  initialData: CourseGroup;
  onClose: () => void;
  handleSubmitEditForm: (dateString: CourseGroup) => void;
  isPending: boolean;
}) => {
  const formattedInitialData = {
    ...initialData,
    date_start: formatDateToThai(initialData.date_start),
    date_end: formatDateToThai(initialData.date_end),
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formattedInitialData,
    resolver: yupResolver(editBatchSchema),
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSubmit(handleSubmitEditForm)}
        className="flex flex-col gap-4"
      >
        <h1 className="text-2xl text-black dark:text-white font-bold mb-4 font-notoLoopThaiRegular">
          แก้ไขข้อมูลรุ่นหลักสูตรเบื้องต้น
        </h1>
        <TextField
          label="หลักสูตรรุ่นที่"
          name="batch"
          includeRegister={register}
          placeholder="หลักสูตรรุ่นที่ (ตัวเลข)"
          required={true}
          type="number"
          error={
            typeof errors.batch?.message === 'string'
              ? errors.batch.message
              : ''
          }
        />
        <TextField
          label="จำนวนนักเรียนที่รับเข้า"
          name="max_students"
          includeRegister={register}
          placeholder="จำนวนนักเรียนที่รับเข้า"
          required={true}
          type="number"
          error={
            typeof errors.max_students?.message === 'string'
              ? errors.max_students.message
              : ''
          }
        />
        <DatePickerWithController
          label="วันที่เริ่ม"
          name="date_start"
          placeholder="เลือกวันที่เริ่ม"
          control={control}
          error={
            typeof errors.date_start?.message === 'string'
              ? errors.date_start.message
              : ''
          }
          value={
            formattedInitialData.date_start as `${number}-${number}-${number} ${number}:${number}:${number}`
          }
          required
        />
        <DatePickerWithController
          label="วันที่สิ้นสุด"
          name="date_end"
          placeholder="เลือกวันที่สิ้นสุด"
          control={control}
          error={
            typeof errors.date_end?.message === 'string'
              ? errors.date_end.message
              : ''
          }
          value={
            formattedInitialData.date_end as `${number}-${number}-${number} ${number}:${number}:${number}`
          }
          required
        />
        <div className="mt-4 h-10 flex justify-start gap-4">
          <Button
            type="submit"
            className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            <div className="flex items-center gap-2">
              {isPending && <Spinner className="w-4 h-4" color="blue" />}
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </div>
          </Button>
          <Button
            className="bg-red-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-red-600 disabled:bg-red-300"
            onClick={onClose}
          >
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCourseBatchForm;
