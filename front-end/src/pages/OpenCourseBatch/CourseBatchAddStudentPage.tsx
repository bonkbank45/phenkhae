import React, { useEffect, useState } from 'react';
import { useCourseBatchDataById } from '../../hooks/api/useCourseBatchData';
import { useStudentData } from '../../hooks/api/useStudentData';
import { useAddEnrollment } from '../../hooks/api/useEnrollmentData';
import { useParams } from 'react-router-dom';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { Button } from '@material-tailwind/react';
import useDebounce from '../../hooks/useDebounce';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import { Student } from '../../types/student';
import Spinner from '../../common/Spinner';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';
import NotFound from '../NotFound';

interface SelectedStudent {
  id: number;
  firstname_tha: string;
  lastname_tha: string;
}

const CourseBatchAddStudentPage = () => {
  const { id } = useParams();
  const { mutate: addEnrollment, isPending } = useAddEnrollment();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [ageRange, setAgeRange] = useState<string>('all');
  const [experience, setExperience] = useState<string>('all');
  const [education, setEducation] = useState<string>('all');
  const [recentlyAdded, setRecentlyAdded] = useState<string>('all');
  const {
    data: courseBatch,
    isLoading: isLoadingCourseBatch,
    isError: isErrorCourseBatch,
    refetch: refetchCourseBatch,
  } = useCourseBatchDataById(id);
  const [page, setPage] = useState<number>(1);
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>(
    [],
  );
  const {
    data: students,
    isLoading: isLoadingStudents,
    isFetching: isFetchingStudents,
    refetch: refetchStudents,
  } = useStudentData({
    searchTerm: debouncedSearchTerm,
    courseBatchId: id,
    page: page,
    recentlyAdded: recentlyAdded,
    ageRange: ageRange,
    experience: experience,
    education: education,
  });

  console.log(students);

  const filterOptions = {
    ageRange: [
      { value: '20-30', label: '20-30 ปี' },
      { value: '31-40', label: '31-40 ปี' },
      { value: '41-50', label: '41-50 ปี' },
      { value: '51+', label: '51 ปีขึ้นไป' },
    ],

    experience: [
      { value: 'hasExpLearn', label: 'เคยนวด/เรียน' },
      { value: 'hasExpWork', label: 'เคยทำงานเกี่ยวข้องกับนวดไทย' },
    ],

    education: [
      { value: 'below', label: 'ต่ำกว่าปริญญาตรี' },
      { value: 'bachelor', label: 'ปริญญาตรี' },
      { value: 'above', label: 'สูงกว่าปริญญาตรี' },
    ],

    recentlyAdded: [
      { value: 'today', label: 'วันนี้' },
      { value: 'yesterday', label: 'เมื่อวาน' },
      { value: 'last7days', label: '7 วันที่ผ่านมา' },
      { value: 'last30days', label: '30 วันที่ผ่านมา' },
    ],
  };

  const columns = [
    {
      header: 'เลือก',
      key: 'select',
      render: (item: Student) => (
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
      render: (item: Student) => item.firstname_tha || '-',
    },
    {
      header: 'นามสกุลนักเรียน',
      key: 'lastname_tha',
      render: (item: Student) => item.lastname_tha || '-',
    },
    {
      header: 'อีเมล',
      key: 'email',
      render: (item: Student) => item.email || '-',
    },
    {
      header: 'เบอร์โทรศัพท์',
      key: 'phonenumber',
      render: (item: Student) => item.phonenumber || '-',
    },
  ];

  const handleStudentSelect = (student: Student) => {
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

  const handleAgeRangeFilter = (input: string) => {
    setAgeRange(input);
    setPage(1);
  };

  const handleExperienceFilter = (input: string) => {
    setExperience(input);
    setPage(1);
  };

  const handleEducationFilter = (input: string) => {
    setEducation(input);
    setPage(1);
  };

  const handleRecentlyAddedFilter = (input: string) => {
    setRecentlyAdded(input);
    setPage(1);
  };

  const handleSubmit = () => {
    addEnrollment(
      {
        course_group_id: courseBatch?.data.id,
        student_ids: selectedStudents.map((student) => student.id),
      },
      {
        onSuccess: () => {
          toast.success('เพิ่มนักเรียนสำเร็จ');
          refetchCourseBatch();
          refetchStudents();
          setSelectedStudents([]);
          setPage(1);
        },
        onError: (error: ErrorResponse) => {
          console.error('Error', error);
          if (error.response.data.message.includes('Duplicate entry')) {
            toast.error('ไม่สามารถเพิ่มข้อมูลได้ เนื่องจากไอดีรหัสซ้ำในระบบ');
          } else if (!error.response.data.errors) {
            toast.error(error.response.data.message);
          } else {
            toast.error(
              Object.entries(error.response.data.errors)
                .map(([key, value]) => `${key}: ${value.join(', ')}`)
                .join(', ') || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
            );
          }
        },
      },
    );
  };

  const handleCancel = () => {
    setSelectedStudents([]);
    setPage(1);
  };

  if (isLoadingStudents || isLoadingCourseBatch)
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 dark:bg-boxdark">
        <h1 className="text-2xl font-semibold mb-2 dark:text-white font-notoExtraBold">
          เพิ่มนักเรียน : {courseBatch?.data.course.course_name} รุ่นที่{' '}
          {courseBatch?.data.batch}
        </h1>
        <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
          จำนวนที่รับได้: {courseBatch?.data.max_students} คน | ลงทะเบียนแล้ว:{' '}
          {courseBatch?.data.students_enrolled} คน | คงเหลือ:{' '}
          {courseBatch?.data.max_students - courseBatch?.data.students_enrolled}{' '}
          คน
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full lg:w-[75%] bg-white rounded-lg shadow p-4 dark:bg-boxdark">
          <h2 className="text-xl font-semibold mb-4 dark:text-white font-notoExtraBold">
            รายชื่อนักเรียน
          </h2>
          <div className="mb-4 hidden lg:flex overflow-x-auto gap-2">
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
              placeholder="ทุกช่วงเวลา"
              showIcon={false}
            />
          </div>
          <Search
            value={searchTerm}
            onChange={handleSearch}
            placeholder="ค้นหานักเรียนด้วยชื่อ, อีเมลหรือเบอร์โทรศัพท์"
          />
          <div className="h-[calc(100vh-300px)] mt-4 overflow-y-auto">
            <PaginatedTable<Student>
              data={students?.data}
              columns={columns}
              isLoading={isLoadingStudents || isFetchingStudents}
            />
            <Pagination
              isFetching={isFetchingStudents}
              currentPage={page}
              totalPages={students?.data.last_page}
              from={students?.data.from}
              to={students?.data.to}
              total={students?.data.total}
              onPageChange={setPage}
              hasNextPage={!!students?.data.next_page_url}
              hasPrevPage={!!students?.data.prev_page_url}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[25%] bg-white rounded-lg shadow p-4 dark:bg-boxdark">
          <h2 className="text-xl font-semibold mb-4 dark:text-white font-notoExtraBold">
            นักเรียนที่เลือก ({selectedStudents.length})
          </h2>
          <div className="h-[calc(100vh-300px)] overflow-y-auto">
            {/* ตัวอย่างรายการที่เลือก */}
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
                <p className="font-notoLoopThaiRegular dark:text-white">
                  ไม่มีนักเรียนที่เลือก
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          color="red"
          onClick={handleCancel}
          className="font-notoLoopThaiRegular dark:text-white"
        >
          ล้างรายชื่อนักเรียนที่เลือก
        </Button>
        <Button
          color="blue"
          onClick={handleSubmit}
          loading={isPending}
          className={`px-4 py-2 rounded-lg text-white font-notoLoopThaiRegular dark:text-white
            ${
              selectedStudents.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          disabled={selectedStudents.length === 0}
        >
          เพิ่มนักเรียน
        </Button>
      </div>
    </div>
  );
};

export default CourseBatchAddStudentPage;
