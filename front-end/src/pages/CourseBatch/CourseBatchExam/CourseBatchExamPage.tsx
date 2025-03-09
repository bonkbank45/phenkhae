import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@material-tailwind/react';
import { ErrorResponse } from '../../../types/error_response';
import Spinner from '../../../common/Spinner';
import IconArrowLeft from '../../../common/ArrowLeft';
import { useCourseBatchDataById } from '../../../hooks/api/useCourseBatchData';
import { getStatusText } from '../../../utils/course_group';
import { format } from 'date-fns';
import { useExamTableDataByCourseBatchId } from '../../../hooks/api/useExamData';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import { ExamTable } from '../../../types/exam';
import { getExamPeriod } from '../../../utils/exam';
import RoundRemoveRedEyes from '../../../common/RoundRemoveRedEye';
import IconEdit from '../../../common/EditPen';
import IconCrossCircled from '../../../common/CrossCircle';
import Modal from '../../../components/Modal';
import EditCourseBatchExamForm from './CourseBatchExamForm/EditCourseBatchExamForm';
import DeleteCourseBatchExamForm from './CourseBatchExamForm/DeleteCourseBatchExamForm';
import AddCourseBatchExamForm from './CourseBatchExamForm/AddCourseBatchExamForm';
import AddExamTypePage from '../../Exam/AddExamTypeForm';

export default function CourseBatchExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddBatchExamModalOpen, setIsAddBatchExamModalOpen] = useState(false);
  const [isAddExamTypeModalOpen, setIsAddExamTypeModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamTable | null>(null);
  const { data: courseBatchData, isLoading: isCourseBatchDataLoading } =
    useCourseBatchDataById(id);
  const { data: examTableData, isLoading: isExamTableDataLoading } =
    useExamTableDataByCourseBatchId(Number(id));

  if (isCourseBatchDataLoading || isExamTableDataLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  const columns = [
    {
      header: 'ไอดีการสอบ',
      key: 'id',
      render: (row: ExamTable) => row.id,
    },
    {
      header: 'ปี',
      key: 'year',
      render: (row: ExamTable) => row.year,
    },
    {
      header: 'เทอม',
      key: 'term',
      render: (row: ExamTable) => row.term,
    },
    {
      header: 'ประเภทการสอบ',
      key: 'exam_type',
      render: (row: ExamTable) => row.exam_type.exam_type_name,
    },
    {
      header: 'การสอบ',
      key: 'exam_period',
      render: (row: ExamTable) => getExamPeriod(row.exam_period),
    },
    {
      header: 'คะแนนผ่าน',
      key: 'score_pass',
      render: (row: ExamTable) => row.score_pass,
    },
    {
      header: 'คะแนนเต็ม',
      key: 'score_full',
      render: (row: ExamTable) => row.score_full,
    },
    {
      header: 'วันที่เริ่มการสอบ',
      key: 'date_start_exam',
      render: (row: ExamTable) =>
        format(new Date(row.date_start_exam), 'dd/MM/yyyy'),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: ExamTable) => (
        <div className="flex items-center gap-2">
          <button
            title="ดูข้อมูลการสอบนี้"
            onClick={() => {
              navigate(
                `/courses/batchs/${id}/exams/${
                  row.id +
                  '-' +
                  format(new Date(row.date_start_exam), 'dd-MM-yyyy')
                }`,
              );
            }}
          >
            <RoundRemoveRedEyes />
          </button>
          <button
            title="แก้ไขข้อมูลการสอบนี้"
            onClick={() => {
              setSelectedExam(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            title="ลบข้อมูลการสอบนี้"
            onClick={() => {
              console.log(row);
              setSelectedExam(row);
              setIsDeleteModalOpen(true);
            }}
          >
            <IconCrossCircled />
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

      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* ข้อมูลหลักสูตร */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div>
                <h1 className="text-2xl font-notoExtraBold mb-2">
                  {courseBatchData?.data.course.course_name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                  <span className="text-sm">
                    รุ่นที่ {courseBatchData?.data.batch}
                  </span>
                  <span className="text-sm">•</span>
                  <span className="text-sm">
                    {courseBatchData?.data.course.course_category.category_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    color="blue"
                    className="flex items-center gap-2 mt-2"
                    onClick={() => {
                      setIsAddBatchExamModalOpen(true);
                    }}
                  >
                    เพิ่มการสอบ
                  </Button>
                  <Button
                    size="sm"
                    color="blue"
                    className="flex items-center gap-2 mt-2"
                    onClick={() => {
                      setIsAddExamTypeModalOpen(true);
                    }}
                  >
                    เพิ่มประเภทการสอบ
                  </Button>
                </div>
              </div>
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium whitespace-nowrap">
                {getStatusText(
                  courseBatchData?.data.date_start,
                  courseBatchData?.data.date_end,
                )}
              </span>
            </div>
          </div>
          {/* สถิติการสอบ */}
          <div className="flex-1 lg:border-l lg:pl-6 pt-4 lg:pt-0 font-notoLoopThaiRegular">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  จำนวนนักเรียน
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {courseBatchData?.data.students_enrolled}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    / {courseBatchData?.data.max_students} คน
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  จำนวนการสอบทั้งหมด
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {examTableData?.data.total}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    ครั้ง
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
                {format(
                  new Date(courseBatchData?.data.date_start),
                  'dd MMM yyyy',
                )}{' '}
                -{' '}
                {format(
                  new Date(courseBatchData?.data.date_end),
                  'dd MMM yyyy',
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={examTableData?.data}
          columns={columns}
          isLoading={isExamTableDataLoading}
        />
        <Pagination
          isFetching={isExamTableDataLoading}
          currentPage={currentPage}
          totalPages={examTableData?.data.last_page}
          from={examTableData?.data.from}
          to={examTableData?.data.to}
          total={examTableData?.data.total}
          onPageChange={setCurrentPage}
          hasNextPage={examTableData?.data.next_page_url !== null}
          hasPrevPage={examTableData?.data.prev_page_url !== null}
        />
      </div>

      <Modal
        isOpen={isAddBatchExamModalOpen}
        onClose={() => setIsAddBatchExamModalOpen(false)}
        title="เพิ่มการสอบ"
      >
        <AddCourseBatchExamForm
          onSuccess={() => {
            setIsAddBatchExamModalOpen(false);
            toast.success('เพิ่มข้อมูลการสอบเรียบร้อย');
          }}
          onError={() => {
            toast.error('เพิ่มข้อมูลการสอบไม่สำเร็จ');
          }}
        />
      </Modal>

      <Modal
        isOpen={isAddExamTypeModalOpen}
        onClose={() => setIsAddExamTypeModalOpen(false)}
        title="เพิ่มประเภทการสอบ"
      >
        <AddExamTypePage
          onSuccess={() => {
            setIsAddExamTypeModalOpen(false);
            toast.success('เพิ่มประเภทการสอบสำเร็จ');
          }}
        />
      </Modal>

      {selectedExam && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="แก้ไขข้อมูลการสอบ"
          >
            <EditCourseBatchExamForm
              exam={selectedExam}
              onSuccess={() => {
                toast.success('แก้ไขข้อมูลการสอบเรียบร้อย');
                setIsEditModalOpen(false);
              }}
              onError={(error: ErrorResponse) => {
                toast.error(error.message);
              }}
            />
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="ลบข้อมูลการสอบ"
          >
            <DeleteCourseBatchExamForm
              exam={selectedExam}
              onSuccess={() => {
                toast.success('ลบข้อมูลการสอบสำเร็จ');
                setIsDeleteModalOpen(false);
              }}
              onError={(error: ErrorResponse) => {
                toast.error(error.message);
                setIsDeleteModalOpen(false);
              }}
              onClose={() => {
                setIsDeleteModalOpen(false);
              }}
            />
          </Modal>
        </>
      )}
    </>
  );
}
