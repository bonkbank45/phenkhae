import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import IconArrowLeft from '../../../common/ArrowLeft';
import IconCrossCircled from '../../../common/CrossCircle';
import {
  useStudentAttendence,
  useStudentAttendenceBulkUpdate,
} from '../../../hooks/api/useStudentAttendence';
import { useEnrollmentStudentStatusByCourseGroupId } from '../../../hooks/api/useEnrollmentData';
import { useCourseAttendenceById } from '../../../hooks/api/useCourseAttendence';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import Spinner from '../../../common/Spinner';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Modal from '../../../components/Modal';
import CourseBatchAttendenceCheckDelete from './CourseBatchAttendenceCheckDelete';

const CourseBatchAttendenceCheckPage = () => {
  const { id, attendenceId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedStudentAttendence, setSelectedStudentAttendence] = useState(
    {},
  );
  const { data: courseAttendence, isLoading: isLoadingCourseAttendence } =
    useCourseAttendenceById(Number(attendenceId));
  const { data: studentAttendences, isLoading: isLoadingStudentAttendence } =
    useStudentAttendence(Number(attendenceId));

  const {
    mutate: updateStudentAttendence,
    isPending: isLoadingUpdateStudentAttendence,
  } = useStudentAttendenceBulkUpdate();

  const {
    data: enrollmentStudentStatusData,
    isLoading: isLoadingEnrollmentStudentStatus,
  } = useEnrollmentStudentStatusByCourseGroupId(Number(id), currentPage);

  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    if (studentAttendences?.data) {
      const initialAttendance = {};
      studentAttendences.data.forEach((attendance) => {
        initialAttendance[attendance.student_id] = attendance.status === 1;
      });
      setAttendanceData(initialAttendance);
    }
  }, [studentAttendences]);

  if (
    isLoadingStudentAttendence ||
    isLoadingEnrollmentStudentStatus ||
    isLoadingCourseAttendence
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const handleCheckboxChange = (studentId) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleCheckAll = () => {
    const newAttendanceData = {};
    studentAttendencesTable.data.forEach((student) => {
      newAttendanceData[student.student_id] = true;
    });
    setAttendanceData((prev) => ({
      ...prev,
      ...newAttendanceData,
    }));
  };

  const handleUncheckAll = () => {
    const newAttendanceData = {};
    studentAttendencesTable.data.forEach((student) => {
      newAttendanceData[student.student_id] = false;
    });
    setAttendanceData((prev) => ({
      ...prev,
      ...newAttendanceData,
    }));
  };

  const handleSave = () => {
    try {
      const attendancePayload = Object.entries(attendanceData).map(
        ([studentId, isPresent]) => ({
          student_id: parseInt(studentId),
          course_attendence_id: Number(attendenceId),
          status: isPresent ? 1 : 0,
        }),
      );
      updateStudentAttendence(attendancePayload, {
        onSuccess: () => {
          toast.success('บันทึกข้อมูลเรียบร้อย');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
      toast.error(error.message);
    }
  };

  const studentAttendencesTable = {
    data: enrollmentStudentStatusData.data.data.map((student) => ({
      course_attendence_id: Number(attendenceId),
      student_id: student.student_id,
      firstname_tha: student.student.firstname_tha,
      lastname_tha: student.student.lastname_tha,
      status:
        studentAttendences.data.find(
          (attendance) =>
            attendance.student_id === student.student_id &&
            attendance.course_attendence_id === Number(attendenceId),
        )?.status ?? null,
    })),
    current_page: enrollmentStudentStatusData.data.current_page,
    first_page_url: enrollmentStudentStatusData.data.first_page_url,
    from: enrollmentStudentStatusData.data.from,
    last_page: enrollmentStudentStatusData.data.last_page,
    last_page_url: enrollmentStudentStatusData.data.last_page_url,
    links: enrollmentStudentStatusData.data.links,
    next_page_url: enrollmentStudentStatusData.data.next_page_url,
    path: enrollmentStudentStatusData.data.path,
    per_page: enrollmentStudentStatusData.data.per_page,
    prev_page_url: enrollmentStudentStatusData.data.prev_page_url,
    to: enrollmentStudentStatusData.data.to,
    total: enrollmentStudentStatusData.data.total,
  };

  console.log(studentAttendencesTable);

  const columns = [
    {
      header: 'เช็คชื่อ',
      key: 'check_name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={attendanceData[row.student_id] || false}
            onChange={() => handleCheckboxChange(row.student_id)}
          />
        </div>
      ),
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (row) => <div>{row.firstname_tha}</div>,
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (row) => <div>{row.lastname_tha}</div>,
    },
    {
      header: 'สถานะ',
      key: 'status',
      render: (row) => (
        <div>
          {row.status === 1 ? (
            <span className="text-green-500">มาเรียน</span>
          ) : row.status === 0 ? (
            <span className="text-red-500">ขาดเรียน</span>
          ) : (
            <span className="text-gray-500">ยังไม่ได้เช็คชื่อ</span>
          )}
        </div>
      ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row) => (
        <>
          {row.status === 1 || row.status === 0 ? (
            <button
              onClick={() => {
                setIsOpenDeleteModal(true);
                setSelectedStudentAttendence(row);
              }}
            >
              <IconCrossCircled className="w-4 h-4" />
            </button>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
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
        <h1 className="text-2xl font-notoExtraBold mb-2">
          {courseAttendence?.data.course_group.course.course_name}
        </h1>
        <div className="text-gray-600 dark:text-gray-400">
          <p>รุ่นที่ {courseAttendence?.data.course_group.batch}</p>
          <p>
            เช็คชื่อวันที่{' '}
            {format(
              new Date(courseAttendence?.data.attendence_date),
              'dd/MM/yyyy',
            )}
          </p>
          <p>
            ระยะเวลาเรียน:{' '}
            {format(
              new Date(courseAttendence?.data.course_group.date_start),
              'dd/MM/yyyy',
            )}{' '}
            -{' '}
            {format(
              new Date(courseAttendence?.data.course_group.date_end),
              'dd/MM/yyyy',
            )}
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <div className="mb-4 flex gap-2">
          <Button
            color="green"
            className="font-notoLoopThaiRegular"
            onClick={handleCheckAll}
          >
            เช็คชื่อทั้งหมด (ในหน้านี้)
          </Button>
          <Button
            color="red"
            className="font-notoLoopThaiRegular"
            onClick={handleUncheckAll}
          >
            ยกเลิกเช็คชื่อทั้งหมด (ในหน้านี้)
          </Button>
        </div>
        <PaginatedTable
          columns={columns}
          data={studentAttendencesTable}
          isLoading={isLoadingStudentAttendence}
        />
        <Pagination
          currentPage={studentAttendencesTable.current_page}
          totalPages={studentAttendencesTable.last_page}
          onPageChange={setCurrentPage}
          from={studentAttendencesTable.from}
          to={studentAttendencesTable.to}
          total={studentAttendencesTable.total}
          hasNextPage={!!studentAttendencesTable.next_page_url}
          hasPrevPage={!!studentAttendencesTable.prev_page_url}
          isFetching={isLoadingStudentAttendence}
        />
        <div className="mt-4 flex justify-end">
          <Button
            color="blue"
            className="font-notoLoopThaiRegular"
            onClick={handleSave}
            disabled={isLoadingUpdateStudentAttendence}
            loading={isLoadingUpdateStudentAttendence}
          >
            บันทึกการเช็คชื่อ
          </Button>
        </div>
      </div>
      {selectedStudentAttendence && (
        <Modal
          title="ลบการเช็คชื่อนักเรียน"
          isOpen={isOpenDeleteModal}
          onClose={() => setIsOpenDeleteModal(false)}
        >
          <CourseBatchAttendenceCheckDelete
            studentAttendencesTableData={selectedStudentAttendence}
            onSuccess={() => {
              setIsOpenDeleteModal(false);
              toast.success('ลบการเช็คชื่อนักเรียนเรียบร้อย');
              setSelectedStudentAttendence({});
            }}
            onError={() => {
              setIsOpenDeleteModal(false);
              toast.error('ลบการเช็คชื่อนักเรียนไม่สำเร็จ');
            }}
            onClose={() => setIsOpenDeleteModal(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default CourseBatchAttendenceCheckPage;
