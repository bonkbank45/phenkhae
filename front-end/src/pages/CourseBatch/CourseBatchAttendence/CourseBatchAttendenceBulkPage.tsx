import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { useCourseAttendenceByCourseGroupId } from '../../../hooks/api/useCourseAttendence';
import { useEnrollmentStudentStatusByCourseGroupId } from '../../../hooks/api/useEnrollmentData';
import { useStudentAttendenceByCourseBatchId } from '../../../hooks/api/useStudentAttendence';
import { useCourseBatchDataById } from '../../../hooks/api/useCourseBatchData';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import Spinner from '../../../common/Spinner';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useStudentAttendenceLargeBulkUpdate } from '../../../hooks/api/useStudentAttendence';
import { toast } from 'react-toastify';
import IconArrowLeft from '../../../common/ArrowLeft';

const CourseBatchAttendenceBulkPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [attendance, setAttendance] = useState({});

  const { data: courseBatchData, isLoading: isLoadingCourseBatchData } =
    useCourseBatchDataById(id);

  const { data: courseAttendences, isLoading: isLoadingCourseAttendences } =
    useCourseAttendenceByCourseGroupId(Number(id));
  const { data: studentAttendences, isLoading: isLoadingStudentAttendences } =
    useStudentAttendenceByCourseBatchId(Number(id));
  const {
    data: enrollmentStudentStatusData,
    isLoading: isLoadingEnrollmentStudentStatus,
  } = useEnrollmentStudentStatusByCourseGroupId(Number(id), currentPage);

  const { mutate: largeBulkUpdate, isPending: isLoadingLargeBulkUpdate } =
    useStudentAttendenceLargeBulkUpdate();

  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลครบทุกส่วนหรือไม่
    if (
      !enrollmentStudentStatusData?.data ||
      !courseAttendences?.data ||
      !studentAttendences?.data
    ) {
      return;
    }

    // สร้าง Map เก็บประวัติการเช็คชื่อของนักเรียนแต่ละคน
    const studentAttendanceHistory = studentAttendences.data.reduce(
      (acc, record) => {
        if (!acc[record.student_id]) {
          acc[record.student_id] = {};
        }
        acc[record.student_id][record.course_attendence_id] =
          record.status === 1;
        return acc;
      },
      {},
    );

    setAttendance(studentAttendanceHistory);
  }, [
    enrollmentStudentStatusData?.data,
    courseAttendences?.data,
    studentAttendences?.data,
  ]);

  if (
    isLoadingCourseAttendences ||
    isLoadingStudentAttendences ||
    isLoadingEnrollmentStudentStatus ||
    isLoadingCourseBatchData
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const tableData = {
    current_page: enrollmentStudentStatusData.data.current_page,
    data: enrollmentStudentStatusData.data.data.map((enrollment) => {
      // หาข้อมูลการเช็คชื่อของนักเรียนแต่ละคน
      const studentAttendenceMap = {};
      studentAttendences.data.forEach((attendance) => {
        if (attendance.student_id === enrollment.student_id) {
          studentAttendenceMap[attendance.course_attendence_id] =
            attendance.status === 1;
        }
      });

      const attendanceByDate = {};
      courseAttendences.data.forEach((day) => {
        attendanceByDate[day.id] = studentAttendenceMap[day.id] || false;
      });

      return {
        student_id: enrollment.student_id,
        firstname_tha: enrollment.student.firstname_tha,
        lastname_tha: enrollment.student.lastname_tha,
        // เพิ่ม property สำหรับแต่ละวันที่เช็คชื่อ
        ...attendanceByDate,
      };
    }),
    // คัดลอก pagination metadata
    from: enrollmentStudentStatusData.data.from,
    to: enrollmentStudentStatusData.data.to,
    total: enrollmentStudentStatusData.data.total,
    last_page: enrollmentStudentStatusData.data.last_page,
    next_page_url: enrollmentStudentStatusData.data.next_page_url,
    prev_page_url: enrollmentStudentStatusData.data.prev_page_url,
    first_page_url: enrollmentStudentStatusData.data.first_page_url,
    last_page_url: enrollmentStudentStatusData.data.last_page_url,
    links: enrollmentStudentStatusData.data.links,
    path: enrollmentStudentStatusData.data.path,
    per_page: enrollmentStudentStatusData.data.per_page,
  };

  const handleCheck = (studentId, dateId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [dateId]: !prev[studentId]?.[dateId],
      },
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmit = () => {
    console.log('Saving attendance:', attendance);
    largeBulkUpdate(attendance, {
      onSuccess: () => {
        toast.success('บันทึกการเช็คชื่อสำเร็จ');
      },
      onError: (error) => {
        toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:' + error.message);
      },
    });
  };

  const columns = [
    {
      header: 'ชื่อ-นามสกุล',
      key: 'name',
      render: (row) => <div>{`${row.firstname_tha} ${row.lastname_tha}`}</div>,
    },
    ...courseAttendences.data.map((day) => ({
      header: format(new Date(day.attendence_date), 'dd/MM/yyyy'),
      key: day.id.toString(),
      render: (row) => (
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={attendance[row.student_id]?.[day.id] ?? row[day.id]}
          onChange={() => handleCheck(row.student_id, day.id)}
        />
      ),
    })),
  ];

  return (
    <>
      <Button
        variant="text"
        className="mb-4 flex items-center gap-2 underline"
        onClick={() => navigate(-1)}
      >
        <IconArrowLeft className="w-4 h-4" /> <span>ย้อนกลับ</span>
      </Button>

      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <h1 className="text-2xl font-notoExtraBold mb-2">เช็คชื่อนักเรียน</h1>
        <div className="text-gray-600 dark:text-gray-400">
          {courseBatchData?.data.course.course_name}
          <p>รุ่นที่ {courseBatchData?.data.batch}</p>
          <p>
            ระยะเวลาเรียน:{' '}
            {format(new Date(courseBatchData?.data.date_start), 'dd/MM/yyyy')} -{' '}
            {format(new Date(courseBatchData?.data.date_end), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <div className="overflow-auto">
          <PaginatedTable
            columns={columns}
            data={tableData}
            isLoading={isLoadingCourseAttendences}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={enrollmentStudentStatusData.data.last_page}
            onPageChange={handlePageChange}
            from={enrollmentStudentStatusData.data.from}
            to={enrollmentStudentStatusData.data.to}
            total={enrollmentStudentStatusData.data.total}
            hasNextPage={!!enrollmentStudentStatusData.data.next_page_url}
            hasPrevPage={!!enrollmentStudentStatusData.data.prev_page_url}
            isFetching={isLoadingCourseAttendences}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            color="blue"
            className="font-notoLoopThaiRegular"
            onClick={handleSubmit}
            loading={isLoadingLargeBulkUpdate}
            disabled={isLoadingLargeBulkUpdate}
          >
            บันทึกการเช็คชื่อ
          </Button>
        </div>
      </div>
    </>
  );
};

export default CourseBatchAttendenceBulkPage;
