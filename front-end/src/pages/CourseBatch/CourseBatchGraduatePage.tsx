import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconEdit from '../../common/EditPen';
import RoundRemoveRedEye from '../../common/RoundRemoveRedEye';
import IconArrowLeft from '../../common/ArrowLeft';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useEnrollmentStatusGraduateByBatchId } from '../../hooks/api/useEnrollmentData';
import Spinner from '../../common/Spinner';
import { getStatusText } from '../../utils/course_group';
import { format } from 'date-fns';
import { Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import { FileAdditionOne } from '../../common/FileAdditionOne';
import CourseBatchBillAdd from '../CourseBatch/CourseBatchBillPageForm/CourseBatchBillAdd';
import { GraduateStudent } from '../../types/graduate';
import { isStudentGraduate } from '../../utils/enrollment';
import { useCourseCompletion } from '../../hooks/api/useCourseCompletion';
import EditEnrollmentForm from '../Enrollment/EditEnrollmentForm';
import ConfirmGraduateForm from './CourseBatchGraduate/ConfirmGraduateForm';
import { StudentCourseDataTable } from '../../types/enrollment';

const CourseBatchGraduatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<StudentCourseDataTable | null>(null);
  const [confirmDateGraduate, setConfirmDateGraduate] =
    useState<GraduateStudent | null>(null);
  const [addBillStudent, setAddBillStudent] = useState<{
    course_group_id: number;
    student_id: number;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isConfirmDateGraduateModalOpen, setIsConfirmDateGraduateModalOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: enrollmentStatusGraduate,
    isLoading: isLoadingEnrollmentStatusGraduate,
    refetch: refetchEnrollmentStatusGraduate,
  } = useEnrollmentStatusGraduateByBatchId(Number(id), currentPage);

  const {
    mutate: courseCompletionMutation,
    isPending: isLoadingCourseCompletion,
  } = useCourseCompletion();

  if (isLoadingEnrollmentStatusGraduate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!enrollmentStatusGraduate?.data?.data?.[0]) {
    return (
      <div className="flex flex-col justify-center font-notoLoopThaiRegular items-center h-screen">
        <p>ไม่พบข้อมูลนักเรียน</p>
        <Button
          variant="text"
          className="mb-4 flex items-center gap-2 underline"
          onClick={() => navigate(-1)}
        >
          <span className="text-gray-500">ย้อนกลับ</span>
        </Button>
      </div>
    );
  }

  const handleEditEnrollment = (enrollmentStudent: GraduateStudent) => {
    const enrollment = {
      course_group_id: enrollmentStudent.course_group.course_group_id,
      enrollment: enrollmentStudent.enrollment,
      student_id: enrollmentStudent.enrollment.student_id,
      student_name:
        enrollmentStudent.enrollment.firstname_tha +
        ' ' +
        enrollmentStudent.enrollment.lastname_tha,
      course_name: enrollmentStudent.course_name,
      batch_name: String(enrollmentStudent.course_group.batch),
      enrollment_date: format(
        new Date(enrollmentStudent.enrollment.enrollment_date),
        'dd/MM/yyyy',
      ),
      student_start_date: format(
        new Date(enrollmentStudent.enrollment.enrollment_date_start),
        'dd/MM/yyyy',
      ),
      student_end_date: format(
        new Date(enrollmentStudent.enrollment.enrollment_date_end),
        'dd/MM/yyyy',
      ),
      case_status:
        enrollmentStudent.enrollment.activity_case_status === 0
          ? 'ยังไม่ส่งเคส'
          : 'ส่งแล้ว',
      theoretical_score: enrollmentStudent.enrollment.theoretical_score,
      practical_score: enrollmentStudent.enrollment.practical_score,
    };
    setSelectedEnrollment(enrollment);
    setIsEditModalOpen(true);
  };

  const handleAddBill = (student: GraduateStudent) => {
    setAddBillStudent({
      course_group_id: student.course_group.course_group_id,
      student_id: student.enrollment.student_id,
    });
    setIsBillModalOpen(true);
  };

  const courseInfo = enrollmentStatusGraduate.data.data[0];

  const columns = [
    {
      header: 'ไอดี',
      key: 'student_id',
      render: (row: GraduateStudent) => row.enrollment.student_id,
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (row: GraduateStudent) => row.enrollment.firstname_tha,
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (row: GraduateStudent) => row.enrollment.lastname_tha,
    },
    {
      header: 'การเข้าเรียน',
      key: 'attendance_percentage',
      render: (row: GraduateStudent) => {
        const attendance = row.student_attendance;
        const percentage =
          attendance.total_classes === 0
            ? 0
            : (Number(attendance.present_count) / attendance.total_classes) *
              100;
        const isPass = percentage >= 80;

        return (
          <div
            className={`flex items-center gap-2 ${
              isPass ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span>{percentage.toFixed(0)}%</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                isPass
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isPass ? 'ผ่าน' : 'ไม่ผ่าน'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'คะแนนทฤษฎี',
      key: 'theoretical_score',
      render: (row: GraduateStudent) => {
        const score = row.enrollment.theoretical_score;
        const criteria = row.course_group.theoretical_score_criteria;
        const isPass = score !== null && score >= criteria;

        return (
          <div
            className={`flex items-center gap-2 ${
              score === null
                ? 'text-gray-500'
                : isPass
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {score === null ? 'ยังไม่มีคะแนน' : `${score}%`}
          </div>
        );
      },
    },
    {
      header: 'คะแนนปฏิบัติ',
      key: 'practical_score',
      render: (row: GraduateStudent) => {
        const score = row.enrollment.practical_score;
        const criteria = row.course_group.practical_score_criteria;
        const isPass = score !== null && score >= criteria;

        return (
          <div
            className={`flex items-center gap-2 ${
              score === null
                ? 'text-gray-500'
                : isPass
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {score === null ? 'ยังไม่มีคะแนน' : `${score}%`}
          </div>
        );
      },
    },
    {
      header: 'การส่งเคส',
      key: 'activity_case_status',
      render: (row: GraduateStudent) => {
        const status = row.enrollment.activity_case_status;
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              status === 1
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status === 1 ? 'ส่งแล้ว' : 'ยังไม่ส่ง'}
          </span>
        );
      },
    },
    {
      header: 'การจ่ายเงิน',
      key: 'payment_status',
      render: (row: GraduateStudent) => {
        const isPaid =
          row.bill_infos.vol && row.bill_infos.no && row.bill_infos.date_submit;
        return (
          <div className={`flex items-center gap-2`}>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isPaid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isPaid ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (student: GraduateStudent) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate(`/students/${student.enrollment.student_id}`);
            }}
          >
            <RoundRemoveRedEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              handleEditEnrollment(student);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit className="w-4 h-4" />
          </button>
          {student.bill_infos.vol === null && (
            <button
              onClick={() => {
                handleAddBill(student);
              }}
            >
              <FileAdditionOne color="gray" className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'ยืนยันการจบหลักสูตร',
      key: 'confirm_graduate',
      render: (student: GraduateStudent) => (
        <>
          {student.course_completion.course_completion_id ? (
            <span className="text-green-500">ยืนยันเรียบร้อย</span>
          ) : (
            <Button
              className={`${
                isStudentGraduate(student)
                  ? 'bg-green-500'
                  : 'bg-gray-500 opacity-50'
              }`}
              disabled={!isStudentGraduate(student)}
              onClick={() => {
                setConfirmDateGraduate(student);
                setIsConfirmDateGraduateModalOpen(true);
              }}
            >
              ยืนยันการจบหลักสูตร
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        variant="text"
        className="mb-4 flex items-center gap-2 underline"
        onClick={() => navigate(-1)}
      >
        <IconArrowLeft className="w-4 h-4" /> <span>ย้อนกลับ</span>
      </Button>
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-semibold mb-0 font-notoExtraBold">
              {courseInfo.course_name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              รุ่นที่ {courseInfo.course_group?.batch} /{' '}
              {courseInfo.course_group?.date_start?.split('-')[0] || ''}
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            {getStatusText(
              courseInfo.course_group?.date_start || '',
              courseInfo.course_group?.date_end || '',
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
          <div>
            <p className="text-sm">วันที่เริ่มเรียน - สิ้นสุดการเรียน</p>
            <p className="font-medium">
              {courseInfo.course_group?.date_start
                ? format(
                    new Date(courseInfo.course_group.date_start),
                    'dd/MM/yyyy',
                  )
                : ''}{' '}
              -{' '}
              {courseInfo.course_group?.date_end
                ? format(
                    new Date(courseInfo.course_group.date_end),
                    'dd/MM/yyyy',
                  )
                : ''}
            </p>
          </div>
          <div>
            <p className="text-sm">เกณฑ์คะแนนสอบ</p>
            <p className="font-medium">
              ทฤษฎี {courseInfo.course_group?.theoretical_score_criteria || 0}%
              / ปฏิบัติ {courseInfo.course_group?.practical_score_criteria || 0}
              %
            </p>
          </div>
          <div>
            <p className="text-sm">ราคาหลักสูตร</p>
            <p className="font-medium">
              {Number(
                courseInfo.bill_infos?.course_price || 0,
              ).toLocaleString()}{' '}
              บาท
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <h2 className="text-xl font-semibold mb-4 font-notoExtraBold">
          สถานะการจบหลักสูตร
        </h2>
        <PaginatedTable
          columns={columns}
          data={enrollmentStatusGraduate.data}
          isLoading={isLoadingEnrollmentStatusGraduate}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={enrollmentStatusGraduate.data.last_page}
          onPageChange={setCurrentPage}
          from={enrollmentStatusGraduate.data.from}
          to={enrollmentStatusGraduate.data.to}
          total={enrollmentStatusGraduate.data.total}
          hasNextPage={!!enrollmentStatusGraduate.data.next_page_url}
          hasPrevPage={!!enrollmentStatusGraduate.data.prev_page_url}
          isFetching={isLoadingEnrollmentStatusGraduate}
        />
      </div>
      {selectedEnrollment && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="แก้ไขข้อมูลการจบหลักสูตร"
        >
          <EditEnrollmentForm
            enrollment={selectedEnrollment}
            onSuccess={() => {
              toast.success('แก้ไขข้อมูลสำเร็จ');
              setIsEditModalOpen(false);
              refetchEnrollmentStatusGraduate();
            }}
            onError={() => {
              toast.error('แก้ไขข้อมูลไม่สำเร็จ');
              setIsEditModalOpen(false);
            }}
          />
        </Modal>
      )}
      {addBillStudent && (
        <Modal
          isOpen={isBillModalOpen}
          onClose={() => setIsBillModalOpen(false)}
          title="เพิ่มบิล"
        >
          <CourseBatchBillAdd
            courseGroupId={addBillStudent.course_group_id}
            studentId={addBillStudent.student_id}
            onSuccess={() => {
              toast.success('เพิ่มบิลสำเร็จ');
              refetchEnrollmentStatusGraduate();
              setIsBillModalOpen(false);
            }}
            onError={() => {
              toast.error('เพิ่มบิลไม่สำเร็จ');
              setIsBillModalOpen(false);
            }}
          />
        </Modal>
      )}
      {confirmDateGraduate && (
        <Modal
          isOpen={isConfirmDateGraduateModalOpen}
          onClose={() => setIsConfirmDateGraduateModalOpen(false)}
          title="ยืนยันวันที่จบการศึกษา"
        >
          <ConfirmGraduateForm
            graduateData={confirmDateGraduate}
            onSuccess={() => {
              toast.success('ยืนยันการจบหลักสูตรเรียบร้อย');
              setIsConfirmDateGraduateModalOpen(false);
              refetchEnrollmentStatusGraduate();
            }}
            onError={() => {
              toast.error('ยืนยันการจบหลักสูตรไม่สำเร็จ');
              setIsConfirmDateGraduateModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default CourseBatchGraduatePage;
