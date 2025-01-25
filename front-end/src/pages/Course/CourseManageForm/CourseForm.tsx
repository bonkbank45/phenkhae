import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@material-tailwind/react';
import { Course } from '../../../types/course';
import IconArrowLeft from '../../../common/ArrowLeft';
import TextField from '../../../components/Forms/TextField';
import TextArea from '../../../components/Forms/TextArea';
import DropdownSearchWithController from '../../../components/Forms/DropdownSearchWithController';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseFormSchema } from '../../../schema/courses/courseForm';

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: Course) => void;
  isLoading?: boolean;
  formOptions: {
    courseCategories: { value: number; label: string }[];
    courseBillCategories: { value: number; label: string }[];
    resolver: yup.Schema<Course>;
  };
}

const CourseForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  formOptions,
}: CourseFormProps) => {
  const navigate = useNavigate();

  const methods = useForm<Course>({
    defaultValues: {
      ...initialData,
    },
    resolver: yupResolver(courseFormSchema),
  });

  const handleSubmitForm = async (data: Course) => {
    try {
      await onSubmit(data);
      methods.reset(); // จะ reset เมื่อ submit สำเร็จเท่านั้น
    } catch (error) {
      // จัดการ error ถ้าจำเป็น
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        {initialData ? null : (
          <Button
            variant="text"
            type="button"
            className="underline px-0 flex items-center gap-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />{' '}
            <span className="text-black dark:text-white">ย้อนกลับ</span>
          </Button>
        )}
        <h1 className="text-2xl text-black dark:text-white font-bold mb-4 font-notoLoopThaiRegular">
          {initialData ? 'แก้ไขหลักสูตร' : 'เพิ่มหลักสูตร'}
        </h1>
        <form
          onSubmit={methods.handleSubmit(handleSubmitForm)}
          className="space-y-4"
        >
          {initialData ? null : (
            <TextField
              name="id"
              label="ไอดี"
              type="number"
              placeholder="ไอดี"
              required={true}
              includeRegister={() =>
                methods.register('id', {
                  valueAsNumber: true,
                })
              }
              error={methods.formState.errors.id?.message}
            />
          )}
          <TextField
            name="course_name"
            label="ชื่อหลักสูตร"
            placeholder="ชื่อหลักสูตร"
            required={true}
            includeRegister={methods.register}
            error={methods.formState.errors.course_name?.message}
          />
          <TextArea
            name="course_description"
            label="รายละเอียดหลักสูตร"
            placeholder="รายละเอียดหลักสูตร"
            includeRegister={methods.register}
            required={true}
            maxLength={70}
            control={methods.control}
            error={methods.formState.errors.course_description?.message}
          />
          <DropdownSearchWithController
            name="course_category_id"
            label="ประเภทหลักสูตร"
            placeholder="ประเภทหลักสูตร"
            options={formOptions.courseCategories || []}
            control={methods.control}
            required={true}
            error={methods.formState.errors.course_category_id?.message}
          />
          <DropdownSearchWithController
            name="course_category_bill_id"
            label="ประเภทบิล"
            placeholder="ประเภทบิล"
            options={formOptions.courseBillCategories || []}
            control={methods.control}
            required={true}
            error={methods.formState.errors.course_category_bill_id?.message}
          />
          <Button
            type="submit"
            className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            <div className="flex items-center gap-2">
              {isLoading && <Spinner className="w-4 h-4" color="blue" />}
              {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
            </div>
          </Button>
        </form>
      </div>
    </>
  );
};

export default CourseForm;
