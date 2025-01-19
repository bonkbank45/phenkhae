import React, { useState, useEffect } from 'react';
import TextField from '../../../components/Forms/TextField';
import { useFormContext } from 'react-hook-form';
import DatePickerOne from '../../../components/Forms/DatePicker/DatePickerOne';
import { useCourseData } from '../../../hooks/api/useCourseData';

import Modal from '../../../components/Modal';
import { Button } from '@material-tailwind/react';
import { useAllCourseBatchDataByCourseId } from '../../../hooks/api/useCourseBatchData';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const BatchInformation = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { data: courseData } = useCourseData();
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const selectedCourseId = watch('course_id');
  const selectedCourse = courseData?.data.find(
    (course) => course.id === selectedCourseId,
  );
  const {
    data: courseBatchData,
    isLoading,
    error: queryCourseBatchDataError,
  } = useAllCourseBatchDataByCourseId(selectedCourseId);

  const formattedCourseBatchData = courseBatchData?.data.map((group) => ({
    ...group,
    date_start: format(new Date(group.date_start), 'dd MMMM yyyy', {
      locale: th,
    }),
    date_end: format(new Date(group.date_end), 'dd MMMM yyyy', {
      locale: th,
    }),
  }));

  useEffect(() => {
    if (courseBatchData?.data) {
      const nextBatchNumber =
        courseBatchData.data.reduce(
          (max, group) => Math.max(max, group.batch),
          0,
        ) + 1;
      setValue('batch', nextBatchNumber);
    }
  }, [courseBatchData, setValue]);

  return (
    <>
      <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
        กำหนดรายละเอียดรุ่นหลักสูตร
      </h1>
      <p className="mb-5 text-gray-600 dark:text-gray-300 font-notoLoopThaiRegular">
        <strong>หลักสูตรที่เลือก:</strong>{' '}
        {selectedCourse ? selectedCourse.course_name : '-'}{' '}
        <Button
          color="blue"
          className="ml-2"
          onClick={() => setIsEditModal(true)}
        >
          แสดงรุ่นหลักสูตรทั้งหมด
        </Button>
      </p>
      <div className="flex flex-col gap-4">
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
          label="จำนวนนักเรียนที่รับเข้า (สามารถเปลื่ยนแปลงในภายหลังได้)"
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
        <DatePickerOne
          label="วันที่เริ่มหลักสูตร (สามารถเปลื่ยนแปลงในภายหลังได้)"
          name="date_start"
          includeRegister={register}
          placeholder="วันเริ่มหลักสูตร"
          required={true}
          error={
            typeof errors.date_start?.message === 'string'
              ? errors.date_start.message
              : ''
          }
        />
        <DatePickerOne
          label="วันที่สิ้นสุดหลักสูตร (สามารถเปลื่ยนแปลงในภายหลังได้)"
          name="date_end"
          includeRegister={register}
          placeholder="วันสิ้นสุดหลักสูตร"
          required={true}
          error={
            typeof errors.date_end?.message === 'string'
              ? errors.date_end.message
              : ''
          }
        />
      </div>
      <Modal
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        title={`รุ่นหลักสูตรทั้งหมดของ ${selectedCourse?.course_name}`}
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-4">กำลังโหลดข้อมูล...</p>
          ) : queryCourseBatchDataError ? (
            <p className="text-center py-4">
              {queryCourseBatchDataError instanceof Error
                ? queryCourseBatchDataError.message
                : 'เกิดข้อผิดพลาดในการดึงข้อมูลรุ่นหลักสูตรจากระบบ'}
            </p>
          ) : formattedCourseBatchData?.length ? (
            <table className="w-full min-w-max table-auto text-left font-notoLoopThaiRegular">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4">รุ่นที่</th>
                  <th className="p-4">จำนวนนักเรียนสูงสุด</th>
                  <th className="p-4">วันที่เริ่ม</th>
                  <th className="p-4">วันที่สิ้นสุด</th>
                </tr>
              </thead>
              <tbody>
                {formattedCourseBatchData.map((group) => (
                  <tr key={group.id} className="border-b border-gray-200">
                    <td className="p-4">{group.batch}</td>
                    <td className="p-4">{group.max_students}</td>
                    <td className="p-4">{group.date_start}</td>
                    <td className="p-4">{group.date_end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4">ไม่พบข้อมูลรุ่นหลักสูตร</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default BatchInformation;
