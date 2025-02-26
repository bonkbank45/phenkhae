import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseCompletionTable } from '../../hooks/api/useCourseCompletion';
import { useCourseData } from '../../hooks/api/useCourseData';
import { useGetAllCourseBatchNumberByCourseId } from '../../hooks/api/useCourseBatchData';
import { CourseCompletion } from '../../types/course_completion';
import { Course } from '../../types/course';
import { format } from 'date-fns';
import useDebounce from '../../hooks/useDebounce';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import Spinner from '../../common/Spinner';
import { ColumnType } from '../../components/Tables/Table';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import Certificate from '../../common/Certificate';
import DateRangePicker from '../../components/DateRange/DateRangePicker';
import { Button } from '@material-tailwind/react';
import Modal from '../../components/Modal';
import { useGeneratePdfStudentCertificate } from '../../hooks/api/usePdfData';

const CourseGraduateManagePage = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompletion, setSelectedCompletion] =
    useState<CourseCompletion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [dateSearchStart, setDateSearchStart] = useState<Date | null>(null);
  const [dateSearchEnd, setDateSearchEnd] = useState<Date | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isClickDownload, setIsClickDownload] = useState(false);
  const {} = useGeneratePdfStudentCertificate(
    String(selectedCompletion?.id),
    isClickDownload,
  );
  useEffect(() => {
    if (isClickDownload) {
      setIsClickDownload(false);
    }
  }, [isClickDownload]);

  const { data: courseCompletions, isLoading: isLoadingCompletions } =
    useCourseCompletionTable(
      currentPage,
      'false',
      courseFilter,
      batchFilter,
      debouncedSearchTerm,
      dateSearchStart ? format(dateSearchStart, 'yyyy-MM-dd') : null,
      dateSearchEnd ? format(dateSearchEnd, 'yyyy-MM-dd') : null,
    );

  const { data: courseData, isLoading: isLoadingCourseData } = useCourseData();

  const { data: courseBatchNumber, isLoading: isLoadingCourseBatchNumber } =
    useGetAllCourseBatchNumberByCourseId(
      courseFilter !== 'all' ? Number(courseFilter) : null,
    );

  if (isLoadingCompletions || isLoadingCourseData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const handleDateSearchStart = (value: Date) => {
    setDateSearchStart(value);
  };

  const handleDateSearchEnd = (value: Date) => {
    setDateSearchEnd(value);
  };

  const handleClearDateSearch = () => {
    setDateSearchStart(null);
    setDateSearchEnd(null);
    setCurrentPage(1);
  };

  const courseDropdownOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...(courseData?.data || []).map((course: Course) => ({
      label: course.course_name,
      value: course.id,
    })),
  ];

  const courseBatchDropdownOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...(courseBatchNumber?.data?.batch || []).map((batch: number) => ({
      label: `รุ่นที่ ${batch}`,
      value: batch.toString(),
    })),
  ];

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setCurrentPage(1);
  };

  const handleCourseFilter = (input: string) => {
    setCourseFilter(input);
    setBatchFilter('all');
    setCurrentPage(1);
  };

  const handleBatchFilter = (input: string) => {
    setBatchFilter(input);
    setCurrentPage(1);
  };

  const columns: ColumnType<CourseCompletion>[] = [
    {
      header: 'รหัสนักเรียน',
      key: 'id',
      render: (completion: CourseCompletion) => completion.student.id || '-',
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (completion: CourseCompletion) =>
        completion.student.firstname_tha || '-',
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (completion: CourseCompletion) =>
        completion.student.lastname_tha || '-',
    },
    {
      header: 'หลักสูตร',
      key: 'course_name',
      render: (completion: CourseCompletion) =>
        completion.course_group.course.course_name || '-',
    },
    {
      header: 'รุ่นที่',
      key: 'batch',
      render: (completion: CourseCompletion) =>
        completion.course_group.batch || '-',
    },
    {
      header: 'วันที่สำเร็จการศึกษา',
      key: 'completion_date',
      render: (completion: CourseCompletion) =>
        completion.completion_date
          ? format(new Date(completion.completion_date), 'dd/MM/yyyy')
          : '-',
    },
    {
      header: 'สถานะ',
      key: 'status',
      render: (completion: CourseCompletion) =>
        completion.certificate_status ? (
          <span className="text-green-500">มารับใบประกาศณียบัตรแล้ว</span>
        ) : (
          <span className="text-red-500">ยังไม่มารับใบประกาศณียบัตร</span>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (completion: CourseCompletion) => (
        <div className="flex items-center gap-2">
          <button
            title="ดาวน์โหลดใบประกาศนียบัตร"
            onClick={() => {
              setIsClickDownload(true);
              setSelectedCompletion(completion);
            }}
          >
            <Certificate />
          </button>
          <button
            title="แก้ไขข้อมูล"
            onClick={() => {
              setSelectedCompletion(completion);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            title="ลบข้อมูล"
            onClick={() => {
              setSelectedCompletion(completion);
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
    <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-0 font-notoExtraBold">
        ข้อมูลผู้สำเร็จการศึกษา
      </h2>
      <div className="mt-4">
        <div className="mb-4 hidden lg:flex lg:justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter
              value={courseFilter}
              onChange={handleCourseFilter}
              options={courseDropdownOptions}
              placeholder="หลักสูตรทั้งหมด"
              showIcon={true}
            />
            <Filter
              value={batchFilter}
              onChange={handleBatchFilter}
              options={courseBatchDropdownOptions}
              placeholder="รุ่นทั้งหมด"
              showIcon={false}
              isDisabled={
                !courseFilter ||
                courseFilter === 'all' ||
                courseBatchDropdownOptions.length === 1
              }
              isLoading={isLoadingCourseBatchNumber}
            />
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker
              startDate={dateSearchStart}
              endDate={dateSearchEnd}
              onStartDateChange={handleDateSearchStart}
              onEndDateChange={handleDateSearchEnd}
              onClear={handleClearDateSearch}
            />
          </div>
        </div>
        <div className="mb-4">
          <Search
            value={searchTerm}
            onChange={handleSearch}
            placeholder="ค้นหาด้วยรหัสนักเรียน, ชื่อหรือนามสกุลนักเรียน"
          />
        </div>
        <div className="flex justify-start mb-4 gap-2">
          <Button
            color="blue"
            size="sm"
            onClick={() => navigate('/courses/graduate/list/pdf')}
            className="py-3 font-notoLoopThaiRegular flex items-center gap-1"
          >
            พิมพ์รายชื่อนักเรียนที่จบการศึกษาจากหลักสูตร
          </Button>
        </div>
      </div>
      <PaginatedTable
        data={courseCompletions?.data}
        columns={columns}
        isLoading={isLoadingCompletions}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={courseCompletions?.data?.last_page}
        from={courseCompletions?.data?.from}
        to={courseCompletions?.data?.to}
        total={courseCompletions?.data?.total}
        onPageChange={setCurrentPage}
        hasNextPage={!!courseCompletions?.data?.next_page_url}
        hasPrevPage={!!courseCompletions?.data?.prev_page_url}
        isFetching={isLoadingCompletions}
      />
      {selectedCompletion && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="แก้ไขข้อมูล"
          >
            {selectedCompletion.student.firstname_tha}{' '}
            {selectedCompletion.student.lastname_tha}{' '}
            {selectedCompletion.course_group.course.course_name} 😎
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="ลบข้อมูล"
          >
            ลบ {selectedCompletion.student.firstname_tha}{' '}
            {selectedCompletion.student.lastname_tha}{' '}
            {selectedCompletion.course_group.course.course_name} 😎 ?
          </Modal>
        </>
      )}
    </div>
  );
};

export default CourseGraduateManagePage;
