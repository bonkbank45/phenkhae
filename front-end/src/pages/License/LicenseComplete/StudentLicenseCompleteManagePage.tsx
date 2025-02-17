import React, { useState } from 'react';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import { LicenseCompleteTable } from '../../../types/license_complete';
import { useCourseLicenseAvailable } from '../../../hooks/api/useCourseData';
import { format } from 'date-fns';
import IconEdit from '../../../common/EditPen';
import IconCrossCircled from '../../../common/CrossCircle';
import Spinner from '../../../common/Spinner';
import {
  UpdateLicenseCompleteStudentProps,
  useLicenseComplete,
} from '../../../hooks/api/useLicenseComplete';
import useDebounce from '../../../hooks/useDebounce';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_green.css';
import { Thai } from 'flatpickr/dist/l10n/th';
import Filter from '../../../components/Filter/Filter';
import Search from '../../../components/Search/Search';
import Modal from '../../../components/Modal';
import EditLicenseComplete from './LicenseCompleteManageForm/EditLicenseComplete';
import DeleteLicenseComplete from './LicenseCompleteManageForm/DeleteLicenseComplete';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../types/error_response';
import DateRangePicker from '../../../components/DateRange/DateRangePicker';

const StudentLicenseCompleteManagePage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [courseId, setCourseId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateSearchStart, setDateSearchStart] = useState<Date | null>(null);
  const [dateSearchEnd, setDateSearchEnd] = useState<Date | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isEditLicenseCompleteModalOpen, setIsEditLicenseCompleteModalOpen] =
    useState<boolean>(false);
  const [
    isDeleteLicenseCompleteModalOpen,
    setIsDeleteLicenseCompleteModalOpen,
  ] = useState<boolean>(false);
  const [selectedLicenseCompleteStudent, setSelectedLicenseCompleteStudent] =
    useState<LicenseCompleteTable | null>(null);

  const { data: licenseCompleteData, isLoading: licenseCompleteLoading } =
    useLicenseComplete(
      currentPage,
      courseId,
      debouncedSearchTerm,
      dateSearchStart,
      dateSearchEnd,
    );

  const {
    data: courseLicenseAvailableData,
    isLoading: courseLicenseAvailableLoading,
  } = useCourseLicenseAvailable();

  const columns = [
    {
      header: 'ไอดีนักเรียน',
      key: 'student_id',
      render: (row: LicenseCompleteTable) => row.student_id,
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (row: LicenseCompleteTable) => row.student.firstname_tha,
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (row: LicenseCompleteTable) => row.student.lastname_tha,
    },
    {
      header: 'หลักสูตร',
      key: 'course_name',
      render: (row: LicenseCompleteTable) => row.course.course_name,
    },
    {
      header: 'วันที่สำเร็จการสอบใบประกอบวิชาชีพ',
      key: 'date_qual',
      render: (row: LicenseCompleteTable) =>
        format(row.date_complete, 'dd/MM/yyyy'),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: LicenseCompleteTable) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedLicenseCompleteStudent(row);
              setIsEditLicenseCompleteModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedLicenseCompleteStudent(row);
              setIsDeleteLicenseCompleteModalOpen(true);
            }}
          >
            <IconCrossCircled />
          </button>
        </div>
      ),
    },
  ];

  if (licenseCompleteLoading || courseLicenseAvailableLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  const handleCourseFilter = (value: string) => {
    setCourseId(value);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDateSearchStart = (value: Date) => {
    setDateSearchStart(value);
  };

  const handleDateSearchEnd = (value: Date) => {
    setDateSearchEnd(value);
  };

  const handleClearDateSearch = () => {
    setDateSearchStart(null);
    setDateSearchEnd(null);
  };

  const courseCategoryOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...courseLicenseAvailableData?.data.map((course) => ({
      label: course.course_name,
      value: course.id,
    })),
  ];

  const licenseCompleteTable = licenseCompleteData?.data;

  return (
    <>
      <div className="mb-4 flex justify-start flex-wrap gap-4">
        <Filter
          value={courseId}
          onChange={handleCourseFilter}
          options={courseCategoryOptions}
          showIcon={true}
          placeholder="หลักสูตรทั้งหมด"
        />
        <DateRangePicker
          startDate={dateSearchStart}
          endDate={dateSearchEnd}
          onStartDateChange={handleDateSearchStart}
          onEndDateChange={handleDateSearchEnd}
          onClear={handleClearDateSearch}
        />
      </div>
      <div className="mb-4">
        <Search
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ค้นหานักเรียนด้วยไอดีนักเรียน, ชื่อหรือนามสกุล"
        />
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={licenseCompleteTable}
          columns={columns}
          isLoading={licenseCompleteLoading}
        />
        <Pagination
          isFetching={licenseCompleteLoading}
          currentPage={currentPage}
          totalPages={licenseCompleteTable?.last_page}
          from={licenseCompleteTable?.from}
          to={licenseCompleteTable?.to}
          total={licenseCompleteTable?.total}
          onPageChange={setCurrentPage}
          hasNextPage={!!licenseCompleteTable?.next_page_url}
          hasPrevPage={!!licenseCompleteTable?.prev_page_url}
        />
      </div>
      {selectedLicenseCompleteStudent && (
        <Modal
          isOpen={isEditLicenseCompleteModalOpen}
          onClose={() => setIsEditLicenseCompleteModalOpen(false)}
          title="แก้ไขข้อมูลวันที่ได้รับใบประกอบวิชาชีพ"
        >
          <EditLicenseComplete
            selectedLicenseCompleteStudent={{
              id: selectedLicenseCompleteStudent?.id,
              student_id: selectedLicenseCompleteStudent?.student_id,
              course_id: selectedLicenseCompleteStudent?.course_id,
              date_complete: selectedLicenseCompleteStudent?.date_complete,
              firstname_tha:
                selectedLicenseCompleteStudent?.student.firstname_tha,
              lastname_tha:
                selectedLicenseCompleteStudent?.student.lastname_tha,
              course_name: selectedLicenseCompleteStudent?.course.course_name,
            }}
            onSuccess={() => {
              setIsEditLicenseCompleteModalOpen(false);
              setSelectedLicenseCompleteStudent(null);
              toast.success('แก้ไขข้อมูลสำเร็จ');
            }}
            onError={(error: ErrorResponse) => {
              toast.error(error.message);
            }}
          />
        </Modal>
      )}
      {selectedLicenseCompleteStudent && (
        <Modal
          isOpen={isDeleteLicenseCompleteModalOpen}
          onClose={() => setIsDeleteLicenseCompleteModalOpen(false)}
          title="ลบข้อมูลวันที่ได้รับใบประกอบวิชาชีพ"
        >
          <DeleteLicenseComplete
            selectedLicenseCompleteStudent={{
              id: selectedLicenseCompleteStudent?.id,
              student_id: selectedLicenseCompleteStudent?.student_id,
              course_id: selectedLicenseCompleteStudent?.course_id,
              firstname_tha:
                selectedLicenseCompleteStudent?.student.firstname_tha,
              lastname_tha:
                selectedLicenseCompleteStudent?.student.lastname_tha,
              date_complete: selectedLicenseCompleteStudent?.date_complete,
            }}
            onSuccess={() => {
              setIsDeleteLicenseCompleteModalOpen(false);
              setSelectedLicenseCompleteStudent(null);
              toast.success('ลบข้อมูลนักเรียนที่ได้รับใบประกอบวิชาชีพสำเร็จ');
            }}
            onError={(error: ErrorResponse) => {
              toast.error(error.message);
            }}
            onClose={() => setIsDeleteLicenseCompleteModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default StudentLicenseCompleteManagePage;
