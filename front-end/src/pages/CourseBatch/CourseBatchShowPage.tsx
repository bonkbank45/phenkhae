import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import IconArrowLeft from '../../common/ArrowLeft';
import { format } from 'date-fns';

const CourseBatchShowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleAddStudent = () => {
    navigate(`/courses/batchs/${id}/add-students`);
  };

  const handleRemoveStudent = () => {
    navigate(`/courses/batchs/${id}/remove-students`);
  };

  const handleBill = () => {
    navigate(`/courses/batchs/${id}/bills`);
  };

  const mockBatchData = {
    id: 1,
    course: {
      course_name: 'หลักสูตรนวดแผนไทย',
    },
    batch: 15,
    date_start: '2024-03-01',
    date_end: '2024-06-30',
    students_enrolled: 25,
    max_students: 30,
    status: 'กำลังดำเนินการ',
  };

  return (
    <>
      <Button
        variant="text"
        type="button"
        className="mb-4 px-0 py-0 flex items-center gap-2 underline"
        onClick={() => {
          navigate(-1);
        }}
      >
        <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />{' '}
        <span className="text-black dark:text-white">ย้อนกลับ</span>
      </Button>
      {/* เพิ่ม Header ใหม่ */}
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-semibold mb-2 font-notoExtraBold">
              {mockBatchData.course.course_name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              รุ่นที่ {mockBatchData.batch} /{' '}
              {mockBatchData.date_start.split('-')[0]}
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            {mockBatchData.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
          <div>
            <p className="text-sm">วันที่เริ่ม - สิ้นสุด</p>
            <p className="font-medium">
              {format(new Date(mockBatchData.date_start), 'dd/MM/yyyy')} -{' '}
              {format(new Date(mockBatchData.date_end), 'dd/MM/yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm">จำนวนนักเรียน</p>
            <p className="font-medium">
              {mockBatchData.students_enrolled}/{mockBatchData.max_students} คน
            </p>
          </div>
          <div>
            <p className="text-sm">สถานะการเรียน</p>
            <p className="font-medium">{mockBatchData.status}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-end gap-2">
        <Button
          color="green"
          onClick={handleAddStudent}
          className="font-notoLoopThaiRegular"
        >
          เพิ่มประวัติการเข้าเรียน
        </Button>
        <Button
          color="green"
          onClick={handleAddStudent}
          className="font-notoLoopThaiRegular"
        >
          เพิ่มนักเรียนเข้ารุ่นหลักสูตร
        </Button>
        <Button
          color="red"
          onClick={handleRemoveStudent}
          className="font-notoLoopThaiRegular"
        >
          ลบนักเรียนออกจากรุ่นหลักสูตร
        </Button>
        <Button
          color="blue"
          onClick={handleBill}
          className="font-notoLoopThaiRegular"
        >
          จัดการการจ่ายเงิน
        </Button>
        <Button
          onClick={handleBill}
          className="bg-gray-500 font-notoLoopThaiRegular"
        >
          จัดการเกณฑ์คะแนนการสอบทฤษฎีและปฏิบัติ
        </Button>
        <Button
          color="gray"
          onClick={handleBill}
          className="bg-gray-500 font-notoLoopThaiRegular"
        >
          ตรวจสอบการจบของนักเรียน
        </Button>
      </div>
    </>
  );
};

export default CourseBatchShowPage;
