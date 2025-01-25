import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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

interface SelectedStudent {
  id: number;
  firstname_tha: string;
  lastname_tha: string;
}

const CourseBatchRemoveStudentPage = () => {
  const { id } = useParams();
  const { mutate: removeEnrollment, isPending } = useRemoveEnrollment();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
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

  const { data: enrolledStudents, isLoading: isLoadingEnrolledStudents } =
    useEnrolledStudentsByBatchId(Number(id), page);

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

  const handleSubmit = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmRemoval = () => {
    removeEnrollment(
      {
        course_group_id: courseBatch?.data.id,
        student_ids: selectedStudents.map((student) => student.id),
      },
      {
        onSuccess: () => {
          toast.success('ลบนักเรียนออกจากรุ่นสำเร็จ');
          refetchCourseBatch();
          setSelectedStudents([]);
          setPage(1);
          setIsConfirmModalOpen(false);
        },
        onError: (error: ErrorResponse) => {
          console.error('Error', error);
          toast.error('เกิดข้อผิดพลาดในการลบนักเรียน กรุณาลองใหม่อีกครั้ง');
        },
      },
    );
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
          <Search
            value={searchTerm}
            onChange={handleSearch}
            placeholder="ค้นหานักเรียนด้วยชื่อ, อีเมลหรือเบอร์โทรศัพท์"
          />
          {/* ... rest of the table code ... */}
        </div>

        {/* Right Column - Selected Students */}
        <div className="w-full lg:w-[25%] bg-white rounded-lg shadow p-4 dark:bg-boxdark">
          <h2 className="text-xl font-semibold mb-4 dark:text-white font-notoExtraBold">
            นักเรียนที่เลือกลบ ({selectedStudents.length})
          </h2>
          {/* ... selected students list ... */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          color="gray"
          onClick={handleCancel}
          className="font-notoLoopThaiRegular dark:text-white"
        >
          ยกเลิก
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
          <p className="text-center font-notoLoopThaiRegular mb-4">
            คุณแน่ใจหรือไม่ที่จะลบนักเรียนที่เลือกออกจากรุ่น?
          </p>
          <div className="flex justify-end gap-4">
            <Button
              color="gray"
              onClick={() => setIsConfirmModalOpen(false)}
              className="font-notoLoopThaiRegular"
            >
              ยกเลิก
            </Button>
            <Button
              color="red"
              onClick={confirmRemoval}
              loading={isPending}
              className="font-notoLoopThaiRegular"
            >
              ยืนยันการลบ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseBatchRemoveStudentPage;
