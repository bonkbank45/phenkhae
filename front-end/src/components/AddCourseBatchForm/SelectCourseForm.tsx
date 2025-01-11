import React from 'react';
import DropdownSearchWithController from '../Forms/DropdownSearchWithController';
import { useFormContext } from 'react-hook-form';
import { useCourseData } from '../../hooks/api/useCourseData';

const SelectCourseForm = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { data: courseData } = useCourseData();
  const selectedCourseId = watch('course_id');

  console.log(courseData);

  const courseOptions =
    courseData?.data.map((course) => ({
      value: course.id,
      label: course.course_name,
    })) || [];

  const selectedCourse = courseData?.data.find(
    (course) => course.id === selectedCourseId,
  );

  return (
    <>
      <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
        เลือกหลักสูตร
      </h1>
      <DropdownSearchWithController
        options={courseOptions}
        label="หลักสูตรทั้งหมด"
        name="course_id"
        control={control}
        placeholder="หลักสูตรทั้งหมด"
        required={true}
        error={
          typeof errors.course_id?.message === 'string'
            ? errors.course_id.message
            : ''
        }
      />
      <div className="flex flex-col space-y-2 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 underline font-notoLoopThaiRegular">
          รายละเอียดหลักสูตร
        </h2>
        <p className="text-gray-600 dark:text-gray-300 font-notoLoopThaiRegular">
          รหัสหลักสูตร : {selectedCourse ? selectedCourse.id : '-'}
        </p>
        <p className="text-gray-600 dark:text-gray-300 font-notoLoopThaiRegular">
          ชื่อหลักสูตร : {selectedCourse ? selectedCourse.course_name : '-'}
        </p>
        <p className="text-gray-600 dark:text-gray-300 font-notoLoopThaiRegular">
          ประเภทหลักสูตร :{' '}
          {selectedCourse ? selectedCourse.course_category.category_name : '-'}
        </p>
        <p className="text-gray-600 dark:text-gray-300 font-notoLoopThaiRegular">
          ราคาหลักสูตร :{' '}
          {selectedCourse
            ? Math.floor(
                selectedCourse.latest_course_price.price,
              ).toLocaleString() + ' บาท'
            : '-'}
        </p>
        <p className="text-gray-600 dark:text-gray-300 font-notoLoopThaiRegular">
          ประเภทบิลหลักสูตร :{' '}
          {selectedCourse
            ? selectedCourse.course_category_bill.category_bill_name
            : '-'}
        </p>
        <p className="text-gray-600 dark:text-gray-300 font-notoLoopThaiRegular">
          คำอธิบายหลักสูตร :{' '}
          {selectedCourse ? selectedCourse.course_description : '-'}
        </p>
      </div>
    </>
  );
};

export default SelectCourseForm;
