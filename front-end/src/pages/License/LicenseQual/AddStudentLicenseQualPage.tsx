/*
 * That code is commented because it is technical not possible add student_qual with course_id
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentData } from '../../../hooks/api/useStudentData';
import useDebounce from '../../../hooks/useDebounce';
import { toast } from 'react-toastify';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import Search from '../../../components/Search/Search';
import { ColumnType } from '../../../components/Tables/Table';
import Filter from '../../../components/Filter/Filter';
import Modal from '../../../components/Modal';
import Spinner from '../../../common/Spinner';
import { Student } from '../../../types/student';
import RoundRemoveRedEye from '../../../common/RoundRemoveRedEye';
import UserAdd from '../../../common/UserAdd';
import { filterOptions } from '../../../constants/filterOptions';
import { AddStudentToQualForm } from './AddForm/AddStudentToQualForm';
import { CourseCompletion } from '../../../types/course_completion';
import {
  useCourseCompletionTable,
  useUnqualifiedCompletions,
} from '../../../hooks/api/useCourseCompletion';
import { useCourseLicenseAvailable } from '../../../hooks/api/useCourseData';
import { Course } from '../../../types/course';
import { useGetAllCourseBatchNumberByCourseId } from '../../../hooks/api/useCourseBatchData';
import { AddStudentsToQualForm } from './AddForm/AddStudentsToQualForm';
import { format } from 'date-fns';

const AddStudentLicenseQualIndex = () => {
  // const navigate = useNavigate();
  // const [isAddStudentToQualModalOpen, setIsAddStudentToQualModalOpen] =
  //   useState(false);
  const [isAddStudentsToQualModalOpen, setIsAddStudentsToQualModalOpen] =
    useState(false);
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  // const [searchTerm, setSearchTerm] = useState('');
  const [searchTermFromStudentCompletion, setSearchTermFromStudentCompletion] =
    useState('');
  const [studentFromCourseCompletionPage, setStudentFromCourseCompletionPage] =
    useState(1);
  const [allStudentsPage, setAllStudentsPage] = useState(1);
  // const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedSearchTermFromStudentCompletion = useDebounce(
    searchTermFromStudentCompletion,
    500,
  );
  // const [ageRange, setAgeRange] = useState<string>('all');
  // const [experience, setExperience] = useState<string>('all');
  // const [education, setEducation] = useState<string>('all');
  // const [recentlyAdded, setRecentlyAdded] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [selectedStudents, setSelectedStudents] = useState<CourseCompletion[]>(
    [],
  );
  // const {
  //   data: apiResponse,
  //   isLoading: isLoadingStudents,
  //   error: errorStudents,
  // } = useStudentData({
  //   searchTerm: debouncedSearchTerm,
  //   page: allStudentsPage,
  //   recentlyAdded: recentlyAdded,
  //   ageRange: ageRange,
  //   experience: experience,
  //   education: education,
  // });

  const {
    data: unqualifiedCompletions,
    isLoading: isLoadingUnqualifiedCompletions,
    refetch: refetchUnqualifiedCompletions,
  } = useUnqualifiedCompletions(
    studentFromCourseCompletionPage,
    'true',
    courseFilter,
    batchFilter,
    debouncedSearchTermFromStudentCompletion,
  );

  const { data: courseBatchNumber, isLoading: isLoadingCourseBatchNumber } =
    useGetAllCourseBatchNumberByCourseId(
      courseFilter !== 'all' ? Number(courseFilter) : null,
    );

  const {
    data: courseLicenseAvailable,
    isLoading: isLoadingCourseLicenseAvailable,
  } = useCourseLicenseAvailable();

  if (
    // isLoadingStudents ||
    isLoadingUnqualifiedCompletions ||
    isLoadingCourseLicenseAvailable
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // const studentsData = apiResponse?.data;
  const unqualifiedCompletionsData = unqualifiedCompletions?.data;

  const courseLicenseAvailableDropdownOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...courseLicenseAvailable?.data.map((course: Course) => ({
      label: course.course_name,
      value: course.id,
    })),
  ];

  const courseBatchDropdownOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...(courseBatchNumber?.data?.batch.map((batch: number) => ({
      label: `รุ่นที่ ${batch}`,
      value: batch.toString(),
    })) || []),
  ];

  // const handleSearch = (input: string) => {
  //   setSearchTerm(input);
  //   setAllStudentsPage(1);
  // };

  const handleSearchFromStudentCompletion = (input: string) => {
    setSearchTermFromStudentCompletion(input);
    setStudentFromCourseCompletionPage(1);
  };

  // const handleAgeRangeFilter = (input: string) => {
  //   setAgeRange(input);
  //   setAllStudentsPage(1);
  // };

  // const handleExperienceFilter = (input: string) => {
  //   setExperience(input);
  //   setAllStudentsPage(1);
  // };

  // const handleEducationFilter = (input: string) => {
  //   setEducation(input);
  //   setAllStudentsPage(1);
  // };

  // const handleRecentlyAddedFilter = (input: string) => {
  //   setRecentlyAdded(input);
  //   setAllStudentsPage(1);
  // };

  const handleCourseFilter = (input: string) => {
    setCourseFilter(input);
    setBatchFilter('all');
    setStudentFromCourseCompletionPage(1);
  };

  const handleBatchFilter = (input: string) => {
    setBatchFilter(input);
    setStudentFromCourseCompletionPage(1);
  };

  const handleStudentSelect = (student: CourseCompletion) => {
    const isSelected = selectedStudents.some(
      (s) => s.student.id === student.student.id,
    );
    if (isSelected) {
      setSelectedStudents(
        selectedStudents.filter((s) => s.student.id !== student.student.id),
      );
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  console.log(selectedStudents);

  const columnsWithCompletion: ColumnType<CourseCompletion>[] = [
    {
      header: 'เลือก',
      key: 'select',
      render: (student: CourseCompletion) => (
        <input
          type="checkbox"
          checked={selectedStudents.some(
            (s) => s.student.id === student.student.id,
          )}
          onChange={() => handleStudentSelect(student)}
          className="cursor-pointer w-4 h-4"
        />
      ),
    },
    {
      header: 'รหัสนักเรียน',
      key: 'id',
      render: (student: CourseCompletion) => student.student.id || '-',
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (student: CourseCompletion) =>
        student.student.firstname_tha || '-',
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (student: CourseCompletion) =>
        student.student.lastname_tha || '-',
    },
    {
      header: 'หลักสูตร',
      key: 'course_name',
      render: (student: CourseCompletion) =>
        student.course_group.course.course_name || '-',
    },
    {
      header: 'รุ่นที่',
      key: 'batch',
      render: (student: CourseCompletion) => student.course_group.batch || '-',
    },
    {
      header: 'วันที่สำเร็จการศึกษา',
      key: 'completion_date',
      render: (student: CourseCompletion) =>
        student.completion_date
          ? format(new Date(student.completion_date), 'dd/MM/yyyy')
          : '-',
    },
  ];

  // const columnsWithBasicInfo: ColumnType<Student>[] = [
  //   {
  //     header: 'รหัสนักเรียน',
  //     key: 'id',
  //     render: (student: Student) => student.id || '-',
  //   },
  //   {
  //     header: 'ชื่อ',
  //     key: 'firstname_tha',
  //     render: (student: Student) => student.firstname_tha || '-',
  //   },
  //   {
  //     header: 'นามสกุล',
  //     key: 'lastname_tha',
  //     render: (student: Student) => student.lastname_tha || '-',
  //   },
  //   {
  //     header: 'รหัสประจำตัวประชาชน',
  //     key: 'citizenid_card',
  //     render: (student: Student) => student.citizenid_card || '-',
  //   },
  //   {
  //     header: 'อีเมล',
  //     key: 'email',
  //     render: (student: Student) => student.email || '-',
  //   },
  //   {
  //     header: 'จัดการ',
  //     key: 'actions',
  //     render: (student: Student) => (
  //       <div className="flex items-center gap-2">
  //         <button onClick={() => navigate(`/students/${student.id}`)}>
  //           <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
  //         </button>
  //         <button
  //           onClick={() => {
  //             setSelectedStudent(student);
  //             setIsAddStudentToQualModalOpen(true);
  //           }}
  //         >
  //           <UserAdd />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-[75%]">
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-0 font-notoExtraBold">
              เพิ่มจากข้อมูลผู้สำเร็จการศึกษาที่มีในระบบ
            </h2>
            <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
              ตารางรายชื่อนักเรียนจากข้อมูลผู้สำเร็จการศึกษา (หลักสูตรที่ 7
              จนถึง หลักสูตรที่ 10)
            </p>
            <div className="mt-4">
              <div className="mb-4 hidden lg:flex lg:justify-start flex-wrap gap-2">
                <Filter
                  value={courseFilter}
                  onChange={handleCourseFilter}
                  options={courseLicenseAvailableDropdownOptions}
                  placeholder="หลักสูตรทั้งหมด"
                  showIcon={true}
                />
                <Filter
                  value={batchFilter}
                  onChange={handleBatchFilter}
                  options={courseBatchDropdownOptions}
                  placeholder="รุ่นทั้งหมด"
                  showIcon={false}
                  isDisabled={!courseFilter || courseFilter === 'all'}
                  isLoading={isLoadingCourseBatchNumber}
                />
              </div>
              <div className="mb-4">
                <Search
                  value={searchTermFromStudentCompletion}
                  onChange={handleSearchFromStudentCompletion}
                  placeholder="ค้นหาด้วยรหัสนักเรียน, ชื่อหรือนามสกุลนักเรียน"
                />
              </div>
            </div>
            <PaginatedTable
              data={unqualifiedCompletionsData}
              columns={columnsWithCompletion}
              isLoading={isLoadingUnqualifiedCompletions}
            />
            <Pagination
              currentPage={studentFromCourseCompletionPage}
              totalPages={unqualifiedCompletionsData?.last_page}
              from={unqualifiedCompletionsData?.from}
              to={unqualifiedCompletionsData?.to}
              total={unqualifiedCompletionsData?.total}
              onPageChange={setStudentFromCourseCompletionPage}
              hasNextPage={!!unqualifiedCompletionsData?.next_page_url}
              hasPrevPage={!!unqualifiedCompletionsData?.prev_page_url}
              isFetching={isLoadingUnqualifiedCompletions}
            />
          </div>
        </div>

        <div className="w-full lg:w-[25%] bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white font-notoExtraBold">
            นักเรียนที่เลือก ({selectedStudents.length})
          </h2>
          <div className="max-h-[500px] overflow-y-auto">
            {selectedStudents.length > 0 ? (
              selectedStudents.map((student) => (
                <div
                  key={student.student.id}
                  className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="font-notoLoopThaiRegular dark:text-white">
                      {student.student.firstname_tha}{' '}
                      {student.student.lastname_tha}
                    </span>
                    <span className="text-sm text-gray-500 font-notoLoopThaiRegular dark:text-gray-400">
                      {student.course_group.course.course_name} รุ่นที่{' '}
                      {student.course_group.batch}
                    </span>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 dark:text-white"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400 font-notoLoopThaiRegular">
                  ไม่มีนักเรียนที่เลือก
                </p>
              </div>
            )}
          </div>
          {selectedStudents.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => setSelectedStudents([])}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-notoLoopThaiRegular"
              >
                ล้างรายการที่เลือก
              </button>
              <button
                onClick={() => {
                  setIsAddStudentsToQualModalOpen(true);
                }}
                className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-notoLoopThaiRegular"
              >
                บันทึกรายการที่เลือก
              </button>
            </div>
          )}
        </div>
      </div>

      {/* <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <h2 className="text-2xl font-semibold mb-0 font-notoExtraBold">
          เพิ่มจากข้อมูลนักเรียนที่มีในระบบ
        </h2>
        <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
          ตารางค้นหารายชื่อนักเรียนด้วยข้อมูลนักเรียนเบื้องต้น
        </p>
        <div className="mt-4 mb-4">
          <div className="mb-4 hidden lg:flex lg:justify-start flex-wrap gap-2">
            <Filter
              value={ageRange}
              onChange={handleAgeRangeFilter}
              options={filterOptions.ageRange}
              placeholder="ทุกช่วงอายุ"
              showIcon={true}
            />
            <Filter
              value={experience}
              onChange={handleExperienceFilter}
              options={filterOptions.experience}
              placeholder="ประสบการณ์ทั้งหมด"
              showIcon={false}
            />
            <Filter
              value={education}
              onChange={handleEducationFilter}
              options={filterOptions.education}
              placeholder="วุฒิการศึกษาทั้งหมด"
              showIcon={false}
            />
            <Filter
              value={recentlyAdded}
              onChange={handleRecentlyAddedFilter}
              options={filterOptions.recentlyAdded}
              placeholder="ระยะเวลาที่เพิ่มเข้าระบบ"
              showIcon={false}
              disablePlaceholder={true}
            />
          </div>
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
          currentPage={allStudentsPage}
          totalPages={studentsData?.last_page}
          from={studentsData?.from}
          to={studentsData?.to}
          total={studentsData?.total}
          onPageChange={setAllStudentsPage}
          hasNextPage={!!studentsData?.next_page_url}
          hasPrevPage={!!studentsData?.prev_page_url}
          isFetching={isLoadingStudents}
        />
      </div> */}
      {/* {selectedStudent && (
        <Modal
          title="เพิ่มข้อมูลผู้มีสิทธิสอบใบประกอบวิชาชีพ"
          isOpen={isAddStudentToQualModalOpen}
          onClose={() => setIsAddStudentToQualModalOpen(false)}
        >
          <AddStudentToQualForm
            student={selectedStudent}
            onSuccess={() => {
              toast.success('เพิ่มข้อมูลผู้มีสิทธิสอบใบประกอบวิชาชีพเรียบร้อย');
              setIsAddStudentToQualModalOpen(false);
            }}
            onError={(error) => {
              toast.error(error.message);
              console.log(error);
            }}
          />
        </Modal>
      )} */}
      {selectedStudents.length > 0 && (
        <Modal
          title="เพิ่มข้อมูลผู้มีสิทธิสอบใบประกอบวิชาชีพ"
          isOpen={isAddStudentsToQualModalOpen}
          onClose={() => setIsAddStudentsToQualModalOpen(false)}
        >
          <AddStudentsToQualForm
            students={selectedStudents}
            onSuccess={() => {
              toast.success('เพิ่มข้อมูลผู้มีสิทธิสอบใบประกอบวิชาชีพเรียบร้อย');
              refetchUnqualifiedCompletions();
              setIsAddStudentsToQualModalOpen(false);
              setSelectedStudents([]);
            }}
            onError={(error) => {
              toast.error(error.message);
              console.log(error);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default AddStudentLicenseQualIndex;
