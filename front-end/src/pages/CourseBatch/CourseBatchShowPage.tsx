import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import IconArrowLeft from '../../common/ArrowLeft';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Spinner from '../../common/Spinner';
import Modal from '../../components/Modal';
import CourseBatchScoreCri from './CourseBatchScoreCri';
import { useCourseBatchDataById } from '../../hooks/api/useCourseBatchData';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useEnrollmentStudentStatusByCourseGroupId } from '../../hooks/api/useEnrollmentData';
import { getStatusText } from '../../utils/course_group';
import { getCourseStatus } from '../../utils/student';
import EditEnrollmentForm from '../Enrollment/EditEnrollmentForm';
import DeleteEnrollmentForm from '../Enrollment/DeleteEnrollmentForm';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import { transformToStudentCourseDataTable } from '../../utils/enrollment';

const CourseBatchShowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isModalEnrollmentEdit, setIsModalEnrollmentEdit] = useState(false);
  const [isModalEnrollmentDelete, setIsModalEnrollmentDelete] = useState(false);
  const {
    data: courseBatchData,
    isLoading: isCourseBatchDataLoading,
    refetch: refetchCourseBatchData,
  } = useCourseBatchDataById(id);
  const {
    data: enrollmentStudentStatus,
    isLoading: isEnrollmentStudentStatusLoading,
    refetch: refetchEnrollmentStudentStatus,
  } = useEnrollmentStudentStatusByCourseGroupId(Number(id), currentPage);

  const [isCriteriaScoreModalOpen, setIsCriteriaScoreModalOpen] =
    useState(false);

  if (isCourseBatchDataLoading || isEnrollmentStudentStatusLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const handleAddStudent = () => {
    navigate(`/courses/batchs/${id}/add-students`);
  };

  const handleRemoveStudent = () => {
    navigate(`/courses/batchs/${id}/remove-students`);
  };

  const handleBill = () => {
    navigate(`/courses/batchs/${id}/bills`);
  };

  const handleGraduate = () => {
    navigate(`/courses/batchs/${id}/graduate`);
  };

  const handleScoreCri = () => {
    navigate(`/courses/batchs/${id}/score-criteria`);
  };

  const handleCriteriaScoreSuccess = () => {
    toast.success('แก้ไขเกณฑ์คะแนนการสอบทฤษฎีและปฏิบัติที่ตั้งไว้เรียบร้อย');
  };

  const handleEnrollmentEditSuccess = () => {
    toast.success('แก้ไขนักเรียนเรียบร้อย');
    setIsModalEnrollmentEdit(false);
    refetchEnrollmentStudentStatus();
  };

  const handleEnrollmentEditError = () => {
    toast.error('แก้ไขนักเรียนไม่สำเร็จ');
  };

  const handleEnrollmentDeleteSuccess = () => {
    toast.success('ลบการลงทะเบียนหลักสูตรนักเรียนเรียบร้อย');
    setIsModalEnrollmentDelete(false);
    refetchEnrollmentStudentStatus();
  };

  const handleEnrollmentDeleteError = () => {
    toast.error('ลบนักเรียนไม่สำเร็จ');
  };

  const columns = [
    {
      header: 'ไอดีนักเรียน',
      key: 'student_id',
      render: (row) => row.student.id,
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (row) => row.student.firstname_tha,
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (row) => row.student.lastname_tha,
    },
    {
      header: 'สถานะการเรียน',
      key: 'course_status',
      render: (row) =>
        getCourseStatus(
          row.course_group.date_start,
          row.course_group.date_end,
          row.date_start,
          row.date_end,
        ),
    },
    {
      header: 'วันที่ลงทะเบียน',
      key: 'enrollment_date',
      render: (row) => format(new Date(row.enrollment_date), 'dd/MM/yyyy'),
    },
    {
      header: 'วันที่เริ่มเรียน',
      key: 'date_start',
      render: (row) => format(new Date(row.date_start), 'dd/MM/yyyy'),
    },
    {
      header: 'วันที่จบการศึกษา',
      key: 'date_end',
      render: (row) =>
        row.date_end === null
          ? '-'
          : format(new Date(row.date_end), 'dd/MM/yyyy'),
    },
    {
      header: 'สถานะการส่งเคส',
      key: 'case_status',
      render: (row) =>
        row.activity_case_status === 0 ? (
          <p className="text-red-500">ยังไม่ส่งเคส</p>
        ) : (
          <p className="text-green-500">ส่งเคสแล้ว</p>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedEnrollment(row);
              setIsModalEnrollmentEdit(true);
            }}
          >
            <IconEdit className="cursor-pointer w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setSelectedEnrollment(row);
              setIsModalEnrollmentDelete(true);
            }}
          >
            <IconCrossCircled className="cursor-pointer w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

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
            <h1 className="text-2xl font-semibold mb-0 font-notoExtraBold">
              {courseBatchData?.data.course.course_name}
            </h1>
            <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">
              ประเภทหลักสูตร{' '}
              {courseBatchData?.data.course.course_category.category_name}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              รุ่นที่ {courseBatchData?.data.batch} /{' '}
              {courseBatchData?.data.date_start.split('-')[0]}
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            {getStatusText(
              courseBatchData?.data.date_start,
              courseBatchData?.data.date_end,
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
          <div>
            <p className="text-sm">วันที่เริ่มเรียน - สิ้นสุดการเรียน</p>
            <p className="font-medium">
              {format(new Date(courseBatchData?.data.date_start), 'dd/MM/yyyy')}{' '}
              - {format(new Date(courseBatchData?.data.date_end), 'dd/MM/yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm">จำนวนนักเรียน</p>
            <p className="font-medium">
              {courseBatchData?.data.students_enrolled}/
              {courseBatchData?.data.max_students} คน
            </p>
          </div>
          <div>
            <p className="text-sm">ราคาปัจจุบัน</p>
            <p className="font-medium">
              {courseBatchData?.data.course.latest_course_price.price} บาท
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-4 bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        {/* กลุ่มจัดการนักเรียน */}
        <div className="flex gap-2">
          <h3 className="text-lg font-medium mb-2">จัดการนักเรียน</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              color="green"
              size="sm"
              onClick={handleAddStudent}
              className="font-notoLoopThaiRegular flex items-center gap-1"
            >
              เพิ่มนักเรียนเข้ารุ่น
            </Button>
            <Button
              color="red"
              size="sm"
              onClick={handleRemoveStudent}
              className="font-notoLoopThaiRegular flex items-center gap-1"
            >
              ลบนักเรียนออกจากรุ่น
            </Button>
          </div>
        </div>

        {/* กลุ่มจัดการการเรียน */}
        <div className="flex gap-2">
          <h3 className="text-lg font-medium mb-2">จัดการการเรียน</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              color="blue"
              size="sm"
              onClick={() => {}}
              className="font-notoLoopThaiRegular flex items-center gap-1"
            >
              บันทึกประวัติการเข้าเรียน
            </Button>
            <Button
              color="blue"
              size="sm"
              onClick={() => setIsCriteriaScoreModalOpen(true)}
              className="font-notoLoopThaiRegular flex items-center gap-1"
            >
              จัดการเกณฑ์คะแนนสอบ
            </Button>
            <Button
              color="blue"
              size="sm"
              onClick={handleGraduate}
              className="font-notoLoopThaiRegular flex items-center gap-1"
            >
              จัดการการจบหลักสูตร
            </Button>
          </div>
        </div>

        {/* กลุ่มจัดการการเงิน */}
        <div className="flex gap-2">
          <h3 className="text-lg font-medium mb-2 font-notoLoopThaiRegular">
            จัดการการเงิน
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={handleBill}
              className="bg-amber-500 font-notoLoopThaiRegular flex items-center gap-1"
            >
              จัดการการจ่ายเงิน
            </Button>
          </div>
        </div>
      </div>
      <PaginatedTable
        columns={columns}
        data={enrollmentStudentStatus?.data}
        isLoading={isEnrollmentStudentStatusLoading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={enrollmentStudentStatus?.data.last_page}
        onPageChange={setCurrentPage}
        from={enrollmentStudentStatus?.data.from}
        to={enrollmentStudentStatus?.data.to}
        total={enrollmentStudentStatus?.data.total}
        hasNextPage={!!enrollmentStudentStatus?.data.next_page_url}
        hasPrevPage={!!enrollmentStudentStatus?.data.prev_page_url}
        isFetching={isEnrollmentStudentStatusLoading}
      />
      <Modal
        isOpen={isCriteriaScoreModalOpen}
        onClose={() => setIsCriteriaScoreModalOpen(false)}
        title="จัดการเกณฑ์คะแนนจบ"
      >
        <CourseBatchScoreCri
          id={courseBatchData?.data.id}
          theory_cri={courseBatchData?.data.theoretical_score_criteria}
          practical_cri={courseBatchData?.data.practical_score_criteria}
          onSuccess={handleCriteriaScoreSuccess}
        />
      </Modal>
      <Modal
        isOpen={isModalEnrollmentEdit}
        onClose={() => setIsModalEnrollmentEdit(false)}
        title="แก้ไขนักเรียน"
      >
        <EditEnrollmentForm
          enrollment={transformToStudentCourseDataTable(selectedEnrollment)}
          onSuccess={handleEnrollmentEditSuccess}
          onError={handleEnrollmentEditError}
        />
      </Modal>
      <Modal
        isOpen={isModalEnrollmentDelete}
        onClose={() => setIsModalEnrollmentDelete(false)}
        title="ลบการลงทะเบียนรุ่นหลักสูตร"
      >
        <DeleteEnrollmentForm
          enrollmentInfo={transformToStudentCourseDataTable(selectedEnrollment)}
          onSuccess={handleEnrollmentDeleteSuccess}
          onError={handleEnrollmentDeleteError}
          onClose={() => setIsModalEnrollmentDelete(false)}
        />
      </Modal>
    </>
  );
};

export default CourseBatchShowPage;
