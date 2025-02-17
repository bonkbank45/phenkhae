import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@material-tailwind/react';
import { useCourseBatchDataById } from '../../hooks/api/useCourseBatchData';
import {
  useEnrolledStudentsByBatchId,
  useRemoveEnrollment,
} from '../../hooks/api/useEnrollmentData';
import useDebounce from '../../hooks/useDebounce';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search/Search';
import Modal from '../../components/Modal';
import Spinner from '../../common/Spinner';
import { Student } from '../../types/student';
import { ErrorResponse } from '../../types/error_response';
import NotFound from '../NotFound';
import { filterOptions } from '../../constants/filterOptions';
import Filter from '../../components/Filter/Filter';
import { EnrollmentWithStudent } from '../../types/enrollment';
import RemoveCourseBatchStudentForm from './RemoveCourseBatchStudentForm';
import IconArrowLeft from '../../common/ArrowLeft';

interface SelectedStudent {
  id: number;
  firstname_tha: string;
  lastname_tha: string;
}

const CourseBatchRemoveStudentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutate: removeEnrollment, isPending } = useRemoveEnrollment();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [ageRange, setAgeRange] = useState<string>('all');
  const [experience, setExperience] = useState<string>('all');
  const [education, setEducation] = useState<string>('all');
  const [recentlyAdded, setRecentlyAdded] = useState<string>('all');
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>(
    [],
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const {
    data: courseBatch,
    isLoading: isLoadingCourseBatch,
    isError: isErrorCourseBatch,
    refetch: refetchCourseBatch,
  } = useCourseBatchDataById(id);

  const {
    data: enrolledStudents,
    isLoading: isLoadingEnrolledStudents,
    refetch: refetchEnrolledStudents,
  } = useEnrolledStudentsByBatchId({
    courseBatchId: Number(id),
    searchTerm: debouncedSearchTerm,
    page: page,
    ageRange: ageRange,
    experience: experience,
    education: education,
    recentlyAdded: recentlyAdded,
  });

  const columns = [
    {
      header: 'เลือก',
      key: 'select',
      render: (item: EnrollmentWithStudent) => (
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={selectedStudents.some((s) => s.id === item.id)}
          onChange={() => handleStudentSelect(item)}
        />
      ),
    },
    {
      header: 'ชื่อนักเรียน',
      key: 'firstname_tha',
      render: (item: EnrollmentWithStudent) => item.firstname_tha || '-',
    },
    {
      header: 'นามสกุลนักเรียน',
      key: 'lastname_tha',
      render: (item: EnrollmentWithStudent) => item.lastname_tha || '-',
    },
    {
      header: 'อีเมล',
      key: 'email',
      render: (item: EnrollmentWithStudent) => item.email || '-',
    },
    {
      header: 'เบอร์โทรศัพท์',
      key: 'phonenumber',
      render: (item: EnrollmentWithStudent) => item.phonenumber || '-',
    },
    {
      header: 'วันที่ลงทะเบียน',
      key: 'enrollment_date',
      render: (item: EnrollmentWithStudent) => item.enrollment_date || '-',
    },
  ];

  const handleStudentSelect = (student: EnrollmentWithStudent) => {
    const isSelected = selectedStudents.some((s) => s.id === student.id);
    if (isSelected) {
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      setSelectedStudents([
        ...selectedStudents,
        {
          id: student.id,
          firstname_tha: student.firstname_tha,
          lastname_tha: student.lastname_tha,
        },
      ]);
    }
  };

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  const handleSubmit = () => {
    setIsConfirmModalOpen(true);
  };

  const handleAgeRangeFilter = (value: string) => {
    setAgeRange(value);
    setPage(1);
  };

  const handleExperienceFilter = (value: string) => {
    setExperience(value);
    setPage(1);
  };

  const handleEducationFilter = (value: string) => {
    setEducation(value);
    setPage(1);
  };

  const handleRecentlyAddedFilter = (value: string) => {
    setRecentlyAdded(value);
    setPage(1);
  };

  const handleCancel = () => {
    setSelectedStudents([]);
    setPage(1);
  };

  if (isLoadingEnrolledStudents || isLoadingCourseBatch)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  if (isErrorCourseBatch) {
    return <NotFound />;
  }

  return (
    <div className="p-1">
      <div className="flex justify-start mb-2">
        <Button
          variant="text"
          type="button"
          className="underline px-0 pt-0 flex items-center gap-2"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />{' '}
          <span className="text-black dark:text-white">ย้อนกลับ</span>
        </Button>
      </div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 dark:bg-boxdark">
        <h1 className="text-2xl font-semibold mb-2 dark:text-white font-notoExtraBold">
          ลบนักเรียนออกจากรุ่น : {courseBatch?.data.course.course_name} รุ่นที่{' '}
          {courseBatch?.data.batch}
        </h1>
        <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
          จำนวนนักเรียนที่ลงทะเบียน: {courseBatch?.data.students_enrolled} คน
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - Student List */}
        <div className="w-full lg:w-[75%] bg-white rounded-lg shadow p-4 dark:bg-boxdark">
          <h2 className="text-xl font-semibold mb-4 dark:text-white font-notoExtraBold">
            รายชื่อนักเรียนในรุ่น
          </h2>
          <div className="mb-4 hidden lg:flex lg:justify-start xl:justify-between flex-wrap gap-2">
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
              placeholder="ระยะเวลาที่ลงทะเบียน"
              showIcon={false}
              disablePlaceholder={true}
            />
          </div>
          <Search
            value={searchTerm}
            onChange={handleSearch}
            placeholder="ค้นหานักเรียนด้วยชื่อ, อีเมลหรือเบอร์โทรศัพท์"
          />
          <div className="h-100vh mt-4 overflow-y-auto">
            <PaginatedTable<Student>
              data={enrolledStudents?.data}
              columns={columns}
              isLoading={isLoadingEnrolledStudents}
            />
            <Pagination
              isFetching={isLoadingEnrolledStudents}
              currentPage={page}
              totalPages={enrolledStudents?.data.last_page}
              from={enrolledStudents?.data.from}
              to={enrolledStudents?.data.to}
              total={enrolledStudents?.data.total}
              onPageChange={setPage}
              hasNextPage={!!enrolledStudents?.data.next_page_url}
              hasPrevPage={!!enrolledStudents?.data.prev_page_url}
            />
          </div>
        </div>

        {/* Right Column - Selected Students */}
        <div className="w-full lg:w-[25%] bg-white rounded-lg shadow p-4 dark:bg-boxdark">
          <h2 className="text-xl font-semibold mb-4 dark:text-white font-notoExtraBold">
            นักเรียนที่เลือกลบ ({selectedStudents.length})
          </h2>
          {selectedStudents.length > 0 ? (
            selectedStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-2"
              >
                <span className="font-notoLoopThaiRegular dark:text-white">
                  {student.firstname_tha} {student.lastname_tha}
                </span>
                <button
                  className="text-red-500 hover:text-red-700 dark:text-white"
                  onClick={() => handleRemoveStudent(student.id)}
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
            <div className="flex items-center justify-center h-full">
              <p className="h-100 font-notoLoopThaiRegular dark:text-white">
                ไม่มีนักเรียนที่เลือก
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          color="gray"
          onClick={handleCancel}
          className="font-notoLoopThaiRegular text-gray-500 dark:text-white"
        >
          ล้างรายชื่อนักเรียนที่เลือก
        </Button>
        <Button
          color="red"
          onClick={handleSubmit}
          loading={isPending}
          className={`font-notoLoopThaiRegular dark:text-white ${
            selectedStudents.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : ''
          }`}
          disabled={selectedStudents.length === 0}
        >
          ลบนักเรียนออกจากรุ่น
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="ยืนยันการลบนักเรียน"
      >
        <div className="p-4">
          {courseBatch && (
            <RemoveCourseBatchStudentForm
              courseBatch={courseBatch.data}
              selectedStudents={selectedStudents}
              onSuccess={() => {
                toast.success('ลบนักเรียนออกจากรุ่นสำเร็จ');
                refetchCourseBatch();
                setSelectedStudents([]);
                setPage(1);
                setIsConfirmModalOpen(false);
              }}
              onError={() => {
                toast.error(
                  'เกิดข้อผิดพลาดในการลบนักเรียน กรุณาลองใหม่อีกครั้ง',
                );
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CourseBatchRemoveStudentPage;
