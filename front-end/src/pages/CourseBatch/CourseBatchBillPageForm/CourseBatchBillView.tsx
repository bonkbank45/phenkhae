import React from 'react';
import { BillInfoViewGroup } from '../../../types/bill_info';
import { useStudentDataById } from '../../../hooks/api/useStudentData';
import { format } from 'date-fns';

const CourseBatchBillView = ({
  vol,
  no,
  exactCourseGroupId,
  studentId,
}: {
  vol: number;
  no: number;
  exactCourseGroupId?: number;
  studentId: number;
}) => {
  const { data: studentData, isLoading } = useStudentDataById(studentId);

  if (isLoading) {
    return (
      <div className="text-center font-notoLoopThaiRegular">กำลังโหลด...</div>
    );
  }

  if (!studentData || !studentData.data || !studentData.data.enrollments) {
    return (
      <div className="text-center font-notoLoopThaiRegular">ไม่พบข้อมูล</div>
    );
  }

  const matchingBills = studentData.data.bill_infos.filter(
    (bill) => bill.vol === vol && bill.no === no,
  );

  if (matchingBills.length === 0) {
    return <div>ไม่พบข้อมูลใบเสร็จ</div>;
  }

  // เลือกข้อมูลแรกสำหรับข้อมูลทั่วไป
  const firstBillInfo = matchingBills[0];

  // แก้ไขส่วนการรวบรวมข้อมูลหลักสูตร
  let coursesForBill = [];
  if (!exactCourseGroupId) {
    coursesForBill = studentData.data.enrollments
      .filter((enroll) => {
        return matchingBills.some(
          (bill) => bill.course_group_id === enroll.course_group_id,
        );
      })
      .map((enroll) => enroll.course_group?.course);
  } else {
    const foundCourse = studentData.data.enrollments.find((enroll) => {
      return enroll.course_group_id === exactCourseGroupId;
    })?.course_group?.course;
    // ถ้าเจอให้ใส่ในarray ถ้าไม่เจอจะเป็น array ว่าง
    coursesForBill = foundCourse ? [foundCourse] : [];
  }

  // สร้าง string รายชื่อหลักสูตรเฉพาะของใบเสร็จนี้
  const courseNames = Array.from(
    new Set(coursesForBill.map((course) => course.course_name)),
  ).join(', ');

  const categoryNames = Array.from(
    new Set(
      coursesForBill.map(
        (course) => course.course_category_bill.category_bill_name,
      ),
    ),
  ).join(', ');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 font-notoLoopThaiRegular">
        <span>Vol. (เล่มที่)</span>
        <span className="font-bold">{firstBillInfo?.vol}</span>
        <span>No. (เลขที่)</span>
        <span className="font-bold">{firstBillInfo?.no}</span>
      </div>

      <div className="flex flex-col gap-1 font-notoLoopThaiRegular">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          ผู้รับเงิน
        </label>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {firstBillInfo?.bill_receiver || '-'}
        </div>
      </div>

      <div className="flex flex-col gap-1 font-notoLoopThaiRegular">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          หมายเหตุ
        </label>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {firstBillInfo?.note || '-'}
        </div>
      </div>

      <div className="flex flex-col gap-1 font-notoLoopThaiRegular">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          วันที่จ่ายเงิน
        </label>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {firstBillInfo?.date_submit
            ? format(new Date(firstBillInfo.date_submit), 'dd/MM/yyyy')
            : '-'}
        </div>
      </div>

      <div className="flex flex-col gap-1 font-notoLoopThaiRegular">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          หลักสูตร
        </label>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {courseNames || '-'}
        </div>
      </div>

      <div className="flex flex-col gap-1 font-notoLoopThaiRegular">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          ประเภทหลักสูตร
        </label>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {categoryNames || '-'}
        </div>
      </div>
    </div>
  );
};

export default CourseBatchBillView;
