import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useCourseData } from '../../hooks/api/useCourseData';
import { useGetAllCourseBatchNumberByCourseId } from '../../hooks/api/useCourseBatchData';
import { Course } from '../../types/course';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import Filter from '../../components/Filter/Filter';
import Spinner from '../../common/Spinner';
import { format } from 'date-fns';
import { useCourseLicenseAvailable } from '../../hooks/api/useCourseData';
import DateRangePicker from '../../components/DateRange/DateRangePicker';
import { Button } from '@material-tailwind/react';
// import { useGeneratePdfGraduate } from '../../hooks/api/usePdfData';
import { ErrorResponse } from '../../types/error_response';
import { useNavigate } from 'react-router-dom';
import IconArrowLeft from '../../common/ArrowLeft';
import { CourseCompletion } from '../../types/course_completion';
import { useCourseCompletionTable } from '../../hooks/api/useCourseCompletion';
import useDebounce from '../../hooks/useDebounce';
import Search from '../../components/Search/Search';
import { useGeneratePdfStudentCompletion } from '../../hooks/api/usePdfData';

const CourseGraduatePdfPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [dateSearchStart, setDateSearchStart] = useState<Date | null>(null);
  const [dateSearchEnd, setDateSearchEnd] = useState<Date | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { mutate: generatePdfStudentCompletion } =
    useGeneratePdfStudentCompletion();

  const { data: courseCompletions, isLoading: isLoadingCompletions } =
    useCourseCompletionTable(
      currentPage,
      'false',
      courseFilter,
      batchFilter,
      debouncedSearchTerm,
      dateSearchStart ? format(dateSearchStart, 'yyyy-MM-dd') : null,
      dateSearchEnd ? format(dateSearchEnd, 'yyyy-MM-dd') : null,
      courseFilter === 'all' || courseFilter === '' ? false : true,
    );

  const { data: courseData, isLoading: isLoadingCourseData } = useCourseData();

  const { data: courseBatchNumber, isLoading: isLoadingCourseBatchNumber } =
    useGetAllCourseBatchNumberByCourseId(
      courseFilter !== 'all' ? Number(courseFilter) : null,
    );

  if (isLoadingCompletions || isLoadingCourseData) {
    return (
      <div className="flex h-screen items-center justify-center">
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

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setCurrentPage(1);
  };

  const handleCourseFilter = (input: string) => {
    setSelectedStudents([]);
    setCourseFilter(input);
    setBatchFilter('all');
    setCurrentPage(1);
  };

  const handleBatchFilter = (input: string) => {
    setBatchFilter(input);
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

  const columns = [
    {
      header: 'เลือก',
      key: 'select',
      render: (row: CourseCompletion) => (
        <input
          type="checkbox"
          checked={selectedStudents.includes(row.id.toString())}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudents([...selectedStudents, row.id.toString()]);
            } else {
              setSelectedStudents(
                selectedStudents.filter((id) => id !== row.id.toString()),
              );
            }
          }}
          className="h-4 w-4 cursor-pointer"
        />
      ),
    },
    {
      header: 'ไอดีนักเรียน',
      key: 'student_id',
      render: (row: CourseCompletion) => row.student_id,
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (row: CourseCompletion) => row.student.firstname_tha,
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (row: CourseCompletion) => row.student.lastname_tha,
    },
    {
      header: 'หลักสูตร',
      key: 'course_name',
      render: (row: CourseCompletion) => row.course_group.course.course_name,
    },
    {
      header: 'รุ่นที่',
      key: 'batch',
      render: (row: CourseCompletion) => row.course_group.batch,
    },
    {
      header: 'วันที่สำเร็จการศึกษา',
      key: 'graduate_date',
      render: (row: CourseCompletion) =>
        format(new Date(row.completion_date), 'dd/MM/yyyy'),
    },
  ];

  const handlePrint = () => {
    if (selectedStudents.length === 0) {
      toast.error('กรุณาเลือกนักเรียนอย่างน้อย 1 คน');
      return;
    }

    const payload = {
      student_completion_ids: selectedStudents,
    };

    console.log(payload);

    generatePdfStudentCompletion(payload, {
      onSuccess: (response) => {
        console.log(response);
        toast.success('สร้างไฟล์ PDF สำเร็จ');
      },
      onError: (error: ErrorResponse) => {
        toast.error(error.message);
      },
    });
  };

  const getTableData = () => {
    if (courseFilter === 'all') {
      return emptyTableData;
    }
    return courseCompletions?.data || emptyTableData;
  };

  const emptyTableData = {
    data: [],
    current_page: 1,
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 10,
    prev_page_url: null,
    to: 0,
    total: 0,
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
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold font-notoExtraBold mb-4">
          พิมพ์รายงาน PDF รายชื่อนักเรียนที่สำเร็จการศึกษา
        </h1>

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

        {selectedStudents.length > 0 && (
          <div className="mb-4">
            <Button
              color="green"
              size="sm"
              onClick={handlePrint}
              className="py-3 font-notoLoopThaiRegular"
            >
              พิมพ์รายชื่อที่เลือก ({selectedStudents.length})
            </Button>
          </div>
        )}

        <PaginatedTable
          data={getTableData()}
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
      </div>
    </>
  );
};

export default CourseGraduatePdfPage;
