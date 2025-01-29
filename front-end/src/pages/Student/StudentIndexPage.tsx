import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useStudentData,
  useStudentCount,
} from '../../hooks/api/useStudentData';
import { useAllCourseBatchDataByCourseIds } from '../../hooks/api/useCourseBatchData';
import IconCrossCircled from '../../common/CrossCircle';
import Spinner from '../../common/Spinner';
import RoundRemoveRedEye from '../../common/RoundRemoveRedEye';
import IconEdit from '../../common/EditPen';
import FilterGroup from '../../components/Filter/FilterGroup';
import Search from '../../components/Search/Search';
import Button from '@material-tailwind/react/components/Button';
import Pagination from '../../components/Pagination';
import PaginatedTable, {
  ColumnType,
} from '../../components/Tables/PaginatedTable';
import Modal from '../../components/Modal';
import DeleteStudentForm from './DeleteStudentForm';
import useDebounce from '../../hooks/useDebounce';
import { useCourseData } from '../../hooks/api/useCourseData';

/* --Import Types-- */
import {
  BasicStudentInfo,
  Student,
  StudentWithCourseBatchTable,
} from '../../types/student';
import {
  CourseGroupByCourseIdResponse,
  CourseGroupTable,
} from '../../types/course_group';
import { useEnrolledStudentsByBatchIds } from '../../hooks/api/useEnrollmentData';
import { toast } from 'react-toastify';
import { getCourseStatus } from '../../utils/student';
/* -- Import Types-- */

interface CourseIdFilter {
  course_id: number;
  course_name: string;
}

export interface SelectedBatch {
  course_id: number;
  batch_id: number[];
}

const StudentIndexPage = () => {
  const navigate = useNavigate();
  const [basicInfoPage, setBasicInfoPage] = useState<number>(1);
  const [courseBatchPage, setCourseBatchPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [courseIdFilter, setCourseIdFilter] = useState<CourseIdFilter[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<SelectedBatch[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentCourseBatch, setSelectedStudentCourseBatch] =
    useState<StudentWithCourseBatchTable | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [
    isSearchingStudentWithCourseBatch,
    setIsSearchingStudentWithCourseBatch,
  ] = useState<boolean>(false);
  const [batchErrors, setBatchErrors] = useState<Record<number, string>>({});
  const [courseFilterError, setCourseFilterError] = useState<string>('');

  /* -- Students Data -- */
  const {
    data: apiResponse,
    isLoading: isLoadingStudents,
    error: errorStudents,
  } = useStudentData({
    searchTerm: debouncedSearchTerm,
    page: basicInfoPage,
  });

  const { data: studentCount } = useStudentCount();
  /* -- Students Data -- */

  /* -- Courses Data Options -- */
  const { data: courseData } = useCourseData();
  const courseOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...(courseData?.data
      ? courseData.data.map((course) => ({
          label: course.course_name,
          value: course.id,
        }))
      : []),
  ];
  /* -- Courses Data Options -- */

  /* -- Course Batches Data -- */
  const {
    data: courseBatchData,
    isLoading: isLoadingCourseBatch,
  }: { data: CourseGroupByCourseIdResponse; isLoading: boolean } =
    useAllCourseBatchDataByCourseIds(
      courseIdFilter.map((course) => course.course_id),
    );
  /* -- Course Batches Data -- */

  /* -- Enrolled Students Data -- */
  const { data: enrolledStudentsData, isLoading: isLoadingEnrolledStudents } =
    useEnrolledStudentsByBatchIds(
      selectedBatch,
      isSearchingStudentWithCourseBatch,
      courseBatchPage,
    );
  /* -- Enrolled Students Data -- */

  console.log('enrolledStudentsData', enrolledStudentsData);

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setBasicInfoPage(1);
  };

  const handleFilterCourseIdChange = (
    selectedOption: {
      label: string;
      value: string;
    }[],
  ) => {
    console.log('selectedOption', selectedOption);
    if (selectedOption.length === 0) {
      setCourseIdFilter([]);
      setSelectedBatch([]);
      return;
    }

    if (selectedOption.some((option) => option.value === 'all')) {
      setSelectedBatch([]);
      setCourseIdFilter([{ course_name: 'ทั้งหมด', course_id: -1 }]);
      setSelectedBatch([{ course_id: -1, batch_id: [-1] }]);
      return;
    }

    /**
     *  New Selected Courses:
     */
    const newSelectedCourseIds = selectedOption.map(
      (option: { label: string; value: string }) => ({
        course_name: option.label,
        course_id: Number(option.value),
      }),
    );

    /**
     * Sync Selected Batches with Selected Courses:
     */
    const newSelectedBatch = selectedBatch.filter((batch: SelectedBatch) => {
      return newSelectedCourseIds.some(
        (course: CourseIdFilter) => course.course_id === batch.course_id,
      );
    });
    setIsSearchingStudentWithCourseBatch(false);
    setCourseIdFilter(newSelectedCourseIds);
    setSelectedBatch(newSelectedBatch);
  };

  const handleBatchChange = (
    courseId: number,
    selectedOptions: (number | 'all')[],
  ) => {
    setBatchErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[courseId];
      return newErrors;
    });

    setIsSearchingStudentWithCourseBatch(false);

    setSelectedBatch((prev: SelectedBatch[]) => {
      const courseIndex = prev.findIndex(
        (item: SelectedBatch) => item.course_id === courseId,
      );

      if ((selectedOptions as string[]).includes('all')) {
        const batchIds = courseBatchData?.data[courseId].map(
          (batch: CourseGroupTable) => batch.id,
        );
        const newBatches = prev.filter(
          (item: SelectedBatch) => item.course_id !== courseId,
        );
        return [...newBatches, { course_id: courseId, batch_id: batchIds }];
      }

      const batchIds = selectedOptions.map((option: number) => option);

      if (courseIndex === -1) {
        return [...prev, { course_id: courseId, batch_id: batchIds }];
      }

      const newBatches = [...prev];
      newBatches[courseIndex] = {
        course_id: courseId,
        batch_id: batchIds as unknown as number[],
      };
      return newBatches;
    });
  };

  const handleSearchCourseBatch = () => {
    console.log('courseIdFilter', courseIdFilter);
    setBatchErrors({});
    setCourseFilterError('');
    const newErrors: Record<number, string> = {};

    if (courseIdFilter.length === 0) {
      setCourseFilterError('กรุณาเลือกหลักสูตร');
      return;
    }

    courseIdFilter.forEach((course) => {
      if (
        !selectedBatch.some(
          (batch) =>
            batch.course_id === course.course_id && batch.batch_id.length > 0,
        )
      ) {
        newErrors[course.course_id] = 'กรุณาเลือกรุ่นของหลักสูตร';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setBatchErrors(newErrors);
      return;
    }

    setIsSearchingStudentWithCourseBatch(true);

    console.log('Selected Courses:', courseIdFilter);
    console.log('Selected Batches:', selectedBatch);
  };

  const columnsWithBasicInfo: ColumnType<Student>[] = [
    {
      header: 'รหัสนักเรียน',
      key: 'id',
      render: (student: Student) => student.id || '-',
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (student: Student) => student.firstname_tha || '-',
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (student: Student) => student.lastname_tha || '-',
    },
    {
      header: 'รหัสประจำตัวประชาชน',
      key: 'citizenid_card',
      render: (student: Student) => student.citizenid_card || '-',
    },
    {
      header: 'อีเมล',
      key: 'email',
      render: (student: Student) => student.email || '-',
    },
    {
      header: 'จัดการ',
      key: 'actions',
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/students/${student.id}`)}>
            <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
          </button>
          <button onClick={() => navigate(`/students/${student.id}/edit`)}>
            <IconEdit className="cursor-pointer w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedStudent(student);
            }}
          >
            <IconCrossCircled className="cursor-pointer w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const columnsWithCourseBatchInfo: ColumnType<StudentWithCourseBatchTable>[] =
    [
      {
        header: 'รหัสนักเรียน',
        key: 'student_id',
        render: (student: StudentWithCourseBatchTable) =>
          student.student_id || '-',
      },
      {
        header: 'ชื่อ',
        key: 'firstname_tha',
        render: (student: StudentWithCourseBatchTable) =>
          student.firstname_tha || '-',
      },
      {
        header: 'นามสกุล',
        key: 'lastname_tha',
        render: (student: StudentWithCourseBatchTable) =>
          student.lastname_tha || '-',
      },
      {
        header: 'จากหลักสูตร',
        key: 'course_name',
        render: (student: StudentWithCourseBatchTable) =>
          student.course_name || '-',
      },
      {
        header: 'รุ่นที่ลงทะเบียน',
        key: 'batch',
        render: (student: StudentWithCourseBatchTable) => student.batch || '-',
      },
      {
        header: 'สถานะการเรียน',
        key: 'status',
        render: (student: StudentWithCourseBatchTable) =>
          getCourseStatus(
            student.batch_start,
            student.batch_end,
            student.student_date_start,
            student.student_date_end,
          ) || '-',
      },
      {
        header: 'จัดการ',
        key: 'actions',
        render: (student: StudentWithCourseBatchTable) => (
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/students/${student.student_id}`)}>
              <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/students/${student.student_id}/edit`)}
            >
              <IconEdit className="cursor-pointer w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedStudentCourseBatch(student);
              }}
            >
              <IconCrossCircled className="cursor-pointer w-5 h-5" />
            </button>
          </div>
        ),
      },
    ];

  const convertToBasicStudentInfo = (
    student: StudentWithCourseBatchTable,
  ): BasicStudentInfo => {
    return {
      id: student.student_id,
      firstname_tha: student.firstname_tha,
      lastname_tha: student.lastname_tha,
    };
  };

  if (isLoadingStudents) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const studentsData = apiResponse?.data;

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 mb-4 dark:bg-boxdark">
        <h1 className="text-2xl font-semibold mb-2 dark:text-white font-notoExtraBold">
          รายชื่อนักเรียน
        </h1>
        <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
          จำนวนนักเรียนในระบบทั้งหมด:{' '}
          {studentCount?.data.total.toLocaleString('th-TH')} คน{' '}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4 dark:bg-boxdark">
        <h1 className="text-2xl font-semibold mb-2 dark:text-white font-notoExtraBold">
          ค้นหารายชื่อนักเรียนด้วยข้อมูลนักเรียนเบื้องต้น
        </h1>
        <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
          ตารางค้นหารายชื่อนักเรียนด้วยข้อมูลนักเรียนเบื้องต้น
        </p>
        <div className="mt-4 mb-4">
          <Search
            value={searchTerm}
            onChange={handleSearch}
            placeholder="ค้นหาด้วยรหัสนักเรียน, ชื่อนักเรียน, อีเมล หรือ รหัสประจำตัวประชาชน"
          />
        </div>
        <PaginatedTable
          data={studentsData || []}
          columns={columnsWithBasicInfo}
          isLoading={isLoadingStudents}
        />
        <Pagination
          currentPage={studentsData?.current_page}
          totalPages={studentsData?.last_page}
          from={studentsData?.from}
          to={studentsData?.to}
          total={studentsData?.total}
          onPageChange={setBasicInfoPage}
          hasNextPage={!!studentsData?.next_page_url}
          hasPrevPage={!!studentsData?.prev_page_url}
          isFetching={isLoadingStudents}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4 dark:bg-boxdark">
        <h1 className="text-2xl font-semibold mb-2 dark:text-white font-notoExtraBold">
          ค้นหารายชื่อนักเรียนด้วยข้อมูลหลักสูตร
        </h1>
        <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
          ตารางค้นหารายชื่อนักเรียนด้วยข้อมูลหลักสูตรที่นักเรียนลงทะเบียนและรุ่นของหลักสูตรที่เลือก
        </p>
        <div className="mt-4 mb-4 flex flex-col gap-2">
          <FilterGroup
            placeholder="หลักสูตรทั้งหมด"
            options={courseOptions || []}
            onChange={handleFilterCourseIdChange}
            error={courseFilterError}
          />
        </div>

        {/* แสดง input สำหรับเลือกรุ่นตามหลักสูตรที่เลือก */}
        {courseIdFilter.length > 0 &&
          !courseIdFilter.some(
            (course) => course.course_name === 'ทั้งหมด',
          ) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseIdFilter.map((course) => {
                const courseBatches =
                  courseBatchData?.data[course.course_id] || [];
                const batchOptions = courseBatches.map((batch) => ({
                  label: `รุ่นที่ ${batch.batch}`,
                  value: batch.id,
                }));
                return (
                  <div
                    key={course.course_id}
                    className={`flex items-center gap-2 p-3 border ${
                      batchErrors[course.course_id]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg dark:border-gray-700`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-white mb-1 font-notoLoopThaiRegular">
                        {course.course_name}
                      </p>
                      <FilterGroup
                        placeholder="ระบุรุ่น"
                        options={
                          courseBatches.length === 0
                            ? []
                            : [
                                { label: 'ทั้งหมด', value: 'all' },
                                ...batchOptions,
                              ]
                        }
                        onChange={(selectedOption) => {
                          handleBatchChange(
                            course.course_id,
                            selectedOption.map((option) => {
                              return option.value;
                            }),
                          );
                        }}
                        error={batchErrors[course.course_id]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        <div className="flex justify-end">
          <Button
            color="blue"
            className="mt-4 font-notoLoopThaiRegular"
            onClick={handleSearchCourseBatch}
            disabled={isLoadingCourseBatch}
            loading={isLoadingEnrolledStudents}
          >
            ค้นหา
          </Button>
        </div>
        <div className="mt-4">
          <PaginatedTable
            data={
              enrolledStudentsData
                ? enrolledStudentsData.data
                : {
                    page: 1,
                    data: [],
                    total: 0,
                    from: 0,
                    to: 0,
                    current_page: 1,
                    last_page: 1,
                    per_page: 10,
                    next_page_url: null,
                    prev_page_url: null,
                    path: '',
                    links: [],
                  }
            }
            columns={columnsWithCourseBatchInfo}
            isLoading={isLoadingEnrolledStudents}
          />
          <Pagination
            currentPage={enrolledStudentsData?.data.current_page || 1}
            totalPages={enrolledStudentsData?.data.last_page || 1}
            from={enrolledStudentsData?.data.from || 0}
            to={enrolledStudentsData?.data.to || 0}
            total={enrolledStudentsData?.data.total || 0}
            onPageChange={setCourseBatchPage}
            hasNextPage={!!enrolledStudentsData?.data.next_page_url}
            hasPrevPage={!!enrolledStudentsData?.data.prev_page_url}
            isFetching={isLoadingEnrolledStudents}
          />
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="ลบรายชื่อนักเรียน"
      >
        {selectedStudent && (
          <DeleteStudentForm
            student={selectedStudent}
            onSuccess={() => {
              toast.success('ลบรายชื่อนักเรียนสำเร็จ');
              setIsDeleteModalOpen(false);
              setSelectedStudent(null);
            }}
            onError={(error) => {
              toast.error(error.message + ' - ลบรายชื่อนักเรียนไม่สำเร็จ');
            }}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedStudent(null);
            }}
          />
        )}
        {selectedStudentCourseBatch && (
          <DeleteStudentForm
            student={convertToBasicStudentInfo(selectedStudentCourseBatch)}
            onSuccess={() => {
              toast.success('ลบรายชื่อนักเรียนสำเร็จ');
              setIsDeleteModalOpen(false);
              setSelectedStudentCourseBatch(null);
            }}
            onError={(error) => {
              toast.error(error.message + ' - ลบรายชื่อนักเรียนไม่สำเร็จ');
            }}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedStudentCourseBatch(null);
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default StudentIndexPage;
