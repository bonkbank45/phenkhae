import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useCourseData } from '../../../hooks/api/useCourseData';

const ConfirmInfomationOpenBatch = () => {
  const { watch } = useFormContext();
  const { data: courseData } = useCourseData();

  const formData = watch();
  console.log(formData);
  const selectedCourse = courseData?.data.find(
    (course) => course.id === formData.course_id,
  );

  return (
    <>
      <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
        ยืนยันข้อมูลการเปิดรุ่นหลักสูตรใหม่
      </h1>

      <div className="space-y-6">
        {/* ข้อมูลหลักสูตร */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 font-notoLoopThaiRegular">
            ข้อมูลหลักสูตร
          </h2>
          <div className="space-y-2 font-notoLoopThaiRegular">
            <p className="text-gray-600 dark:text-gray-300">
              รหัสหลักสูตร: {selectedCourse?.id || '-'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              ชื่อหลักสูตร: {selectedCourse?.course_name || '-'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              ประเภทหลักสูตร:{' '}
              {selectedCourse?.course_category.category_name || '-'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              ราคาหลักสูตร:{' '}
              {selectedCourse?.latest_course_price.price
                ? Math.floor(
                    selectedCourse.latest_course_price.price,
                  ).toLocaleString() + ' บาท'
                : '-'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              ประเภทบิลหลักสูตร:{' '}
              {selectedCourse?.course_category_bill.category_bill_name || '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ข้อมูลการเปิดรุ่นหลักสูตรใหม่ */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 font-notoLoopThaiRegular">
            ข้อมูลการเปิดรุ่นหลักสูตรใหม่
          </h2>
          <div className="space-y-2 font-notoLoopThaiRegular">
            <p className="text-gray-600 dark:text-gray-300">
              รุ่นหลักสูตร: {formData.batch || '-'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              จำนวนนักเรียนที่รับ: {formData.max_students || '-'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              วันที่เริ่มหลักสูตร:{' '}
              {formData.date_start ? formData.date_start : '-'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              วันที่สิ้นสุดหลักสูตร:{' '}
              {formData.date_end ? formData.date_end : '-'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmInfomationOpenBatch;
