import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamDataByExamId } from '../../../hooks/api/useExamData';
import { Button } from '@material-tailwind/react';
import IconArrowLeft from '../../../common/ArrowLeft';
import { getExamPeriod } from '../../../utils/exam';
import { format } from 'date-fns';
import Spinner from '../../../common/Spinner';
import Table from '../../../components/Tables/Table';
import IconEdit from '../../../common/EditPen';
import IconCrossCircled from '../../../common/CrossCircle';
import { useEnrolledStudentsByBatchId } from '../../../hooks/api/useEnrollmentData';
import Modal from '../../../components/Modal';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import { useExamInvidual } from '../../../hooks/api/useExamInvidual';
import { ErrorResponse } from '../../../types/error_response';
import { useExamInvidualDelete } from '../../../hooks/api/useExamInvidual';
import DeleteCourseBatchExamView from './CourseBatchExamViewForm/DeleteCourseBatchExamView';
import EditCourseBatchExamView from './CourseBatchExamViewForm/EditCourseBatchExamView';
import { useGeneratePdfScore } from '../../../hooks/api/usePdfData';

const CourseBatchExamViewPage = () => {
  const { user } = useAuth();
  const { id, examId } = useParams();
  const navigate = useNavigate();
  const [isClickDownload, setIsClickDownload] = useState(false);
  const {
    mutate: addBulk,
    isPending: isAddBulkLoading,
    error: addBulkError,
  } = useExamInvidual();
  const actualExamId = examId?.split('-')[0];
  const [selectedExamInvidual, setSelectedExamInvidual] = useState<any>(null);
  const [isDeleteInvidualModalOpen, setIsDeleteInvidualModalOpen] =
    useState(false);
  const [isEditInvidualModalOpen, setIsEditInvidualModalOpen] = useState(false);
  const [currentAddStudentPage, setCurrentAddStudentPage] = useState(1);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<{
    [key: number]: { selected: boolean; score: string };
  }>({});

  const { isFetching: isLoadingGeneratePdfScore } = useGeneratePdfScore(
    actualExamId,
    isClickDownload,
  );

  useEffect(() => {
    if (isClickDownload) {
      setIsClickDownload(false);
    }
  }, [isClickDownload]);

  const {
    data: enrolledStudents,
    isLoading: isEnrolledStudentsLoading,
    error: enrolledStudentsError,
  } = useEnrolledStudentsByBatchId({
    courseBatchId: Number(id),
    searchTerm: '',
    page: currentAddStudentPage,
    ageRange: 'all',
    experience: 'all',
    education: 'all',
    recentlyAdded: 'all',
  });

  const {
    data: examData,
    isLoading,
    error,
  } = useExamDataByExamId(Number(actualExamId));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!examData?.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>ไม่พบข้อมูลการสอบ</p>
      </div>
    );
  }

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
      header: 'คะแนนที่ได้',
      key: 'score_get',
      render: (row) => row.score_get,
    },
    {
      header: 'สถานะ',
      key: 'status',
      render: (row) => {
        if (row.score_get >= examData.data.score_pass) {
          return <span className="text-green-500">ผ่าน</span>;
        } else {
          return <span className="text-red-500">ไม่ผ่าน</span>;
        }
      },
    },
    {
      header: 'จัดการ',
      key: 'actions',
      render: (row) => {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedExamInvidual(row);
                setIsEditInvidualModalOpen(true);
                console.log(row);
              }}
            >
              <IconEdit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  setSelectedExamInvidual(row);
                  setIsDeleteInvidualModalOpen(true);
                  console.log(row);
                }}
              >
                <IconCrossCircled className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: {
        selected: !prev[studentId]?.selected,
        score: prev[studentId]?.score || '',
      },
    }));
  };

  const handleScoreChange = (studentId: number, score: string) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score,
      },
    }));
  };

  const addStudentColumns = [
    {
      header: 'เลือก',
      key: 'select',
      render: (row) => (
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={selectedStudents[row.id]?.selected || false}
          onChange={() => handleStudentSelection(row.id)}
        />
      ),
    },
    {
      header: 'รหัสนักเรียน',
      key: 'student_id',
      render: (row) => row.id,
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (row) => row.firstname_tha,
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (row) => row.lastname_tha,
    },
    {
      header: 'คะแนน',
      key: 'score',
      render: (row) => (
        <input
          type="number"
          min="0"
          max={examData.data.score_full}
          className="w-20 p-1 border rounded"
          value={selectedStudents[row.id]?.score || ''}
          onChange={(e) => handleScoreChange(row.id, e.target.value)}
          disabled={!selectedStudents[row.id]?.selected}
        />
      ),
    },
  ];

  const existingStudentIds = examData.data.exam_invidual.map(
    (exam) => exam.student.id,
  );

  const filteredStudents = {
    data: {
      data:
        enrolledStudents?.data?.data?.filter(
          (student) => !existingStudentIds.includes(student.id),
        ) ?? [],
      total_pages: enrolledStudents?.data?.total_pages || 1,
      next_page_url: enrolledStudents?.data?.next_page_url || null,
      prev_page_url: enrolledStudents?.data?.prev_page_url || null,
      from: enrolledStudents?.data?.from || 1,
      to: enrolledStudents?.data?.to || 1,
      total: enrolledStudents?.data?.total || 1,
    },
  };

  const handleAddBulk = () => {
    addBulk(
      { ...selectedStudents, id: actualExamId },
      {
        onSuccess: () => {
          setIsAddStudentModalOpen(false);
          toast.success('บันทึกคะแนนสำเร็จ');
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.message.includes('score_get')) {
            toast.error('กรุณากรอกคะแนนให้ถูกต้อง');
          } else {
            toast.error(error.response.data.message);
          }
          console.error(error);
        },
      },
    );
  };

  return (
    <>
      <Button
        variant="text"
        type="button"
        className="mb-4 px-0 py-0 flex items-center gap-2 underline"
        onClick={() => navigate(-1)}
      >
        <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />
        <span className="text-black dark:text-white">ย้อนกลับ</span>
      </Button>

      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* ข้อมูลการสอบ */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div>
                <h1 className="text-2xl font-notoExtraBold mb-2">
                  {examData.data.course_group.course.course_name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                  <span className="text-sm">
                    รุ่นที่ {examData.data.course_group.batch}
                  </span>
                  <span className="text-sm">•</span>
                  <span className="text-sm">
                    {examData.data.exam_type.exam_type_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    color="blue"
                    className="flex items-center gap-2 mt-2"
                    onClick={() => setIsAddStudentModalOpen(true)}
                  >
                    เพิ่มนักเรียนที่ทำการสอบ
                  </Button>
                  {examData.data.exam_invidual.length > 0 && (
                    <Button
                      size="sm"
                      color="blue"
                      className="flex items-center gap-2 mt-2 text-white"
                      onClick={() => {
                        setIsClickDownload(true);
                      }}
                      disabled={isLoadingGeneratePdfScore}
                      loading={isLoadingGeneratePdfScore}
                    >
                      ดาวน์โหลดเอกสารคะแนน
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* รายละเอียดการสอบ */}
          <div className="flex-1 lg:border-l lg:pl-6 pt-4 lg:pt-0 font-notoLoopThaiRegular">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  คะแนนผ่านเกณฑ์
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {examData.data.score_pass}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    คะแนน
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  คะแนนเต็ม {examData.data.score_full} คะแนน
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ช่วงการสอบ
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {getExamPeriod(examData.data.exam_period)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                วันที่สอบ:{' '}
                {format(new Date(examData.data.date_start_exam), 'dd MMM yyyy')}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            data={examData.data.exam_invidual}
            isLoading={isLoading}
          />
        </div>
      </div>

      {isAddStudentModalOpen && (
        <Modal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          title="เพิ่มนักเรียนที่ทำการสอบ"
        >
          <span className="text-sm font-notoLoopThaiRegular text-gray-500 dark:text-gray-400">
            <span className="text-red-500">* </span>
            จะไม่แสดงข้อมูลนักเรียนที่มีคะแนนอยู่แล้ว
          </span>
          <PaginatedTable
            columns={addStudentColumns}
            data={filteredStudents.data}
            isLoading={isEnrolledStudentsLoading}
          />
          <Pagination
            currentPage={currentAddStudentPage}
            totalPages={filteredStudents?.data?.total_pages || 1}
            onPageChange={setCurrentAddStudentPage}
            hasNextPage={filteredStudents?.data?.next_page_url !== null}
            hasPrevPage={filteredStudents?.data?.prev_page_url !== null}
            isFetching={isEnrolledStudentsLoading}
            from={filteredStudents?.data?.from || 1}
            to={filteredStudents?.data?.to || 1}
            total={filteredStudents?.data?.total || 1}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              color="red"
              className="px-4 py-2 font-notoLoopThaiRegular"
              onClick={() => setIsAddStudentModalOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button
              color="blue"
              className="px-4 py-2 font-notoLoopThaiRegular"
              onClick={() => {
                handleAddBulk();
              }}
              disabled={isAddBulkLoading}
              loading={isAddBulkLoading}
            >
              บันทึก
            </Button>
          </div>
        </Modal>
      )}
      {isDeleteInvidualModalOpen && (
        <Modal
          isOpen={isDeleteInvidualModalOpen}
          onClose={() => setIsDeleteInvidualModalOpen(false)}
          title="ลบคะแนนนักเรียน"
        >
          <DeleteCourseBatchExamView
            selectedExamInvidual={selectedExamInvidual}
            onSuccess={() => {
              setIsDeleteInvidualModalOpen(false);
              toast.success('ลบคะแนนนักเรียนสำเร็จ');
            }}
            onError={() => {
              toast.error('ลบคะแนนนักเรียนไม่สำเร็จ');
            }}
            onClose={() => setIsDeleteInvidualModalOpen(false)}
          />
        </Modal>
      )}
      {isEditInvidualModalOpen && (
        <Modal
          isOpen={isEditInvidualModalOpen}
          onClose={() => setIsEditInvidualModalOpen(false)}
          title="แก้ไขคะแนนนักเรียน"
        >
          <EditCourseBatchExamView
            selectedExamInvidual={selectedExamInvidual}
            onSuccess={() => {
              setIsEditInvidualModalOpen(false);
              toast.success('แก้ไขคะแนนนักเรียนสำเร็จ');
            }}
            onError={() => {
              toast.error('แก้ไขคะแนนนักเรียนไม่สำเร็จ');
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default CourseBatchExamViewPage;
