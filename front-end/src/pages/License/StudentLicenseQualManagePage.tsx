import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import Filter from '../../components/Filter/Filter';
import Search from '../../components/Search/Search';
import Spinner from '../../common/Spinner';
import { useGetLicenseQualTable } from '../../hooks/api/useLicenseQual';
import { format } from 'date-fns';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import { LicenseQualTable } from '../../types/license_qual';
import { useCourseLicenseAvailable } from '../../hooks/api/useCourseData';
import useDebounce from '../../hooks/useDebounce';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_green.css';
import { Thai } from 'flatpickr/dist/l10n/th';
import Modal from '../../components/Modal';
import EditLicenseQual from './LicenseQualManageForm/EditLicenseQual';
import DeleteLicenseQual from './LicenseQualManageForm/DeleteLicenseQual';
import { ErrorResponse } from '../../types/error_response';

const StudentLicenseQualManagePage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [courseId, setCourseId] = useState<string>('all');
  const [licenseStatus, setLicenseStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateSearchStart, setDateSearchStart] = useState<Date | null>(null);
  const [dateSearchEnd, setDateSearchEnd] = useState<Date | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedLicenseQualStudent, setSelectedLicenseQualStudent] =
    useState<LicenseQualTable | null>(null);
  const [isEditLicenseQualModalOpen, setIsEditLicenseQualModalOpen] =
    useState<boolean>(false);
  const [isDeleteLicenseQualModalOpen, setIsDeleteLicenseQualModalOpen] =
    useState<boolean>(false);
  const {
    data: tableLicenseQualData,
    isLoading: tableLicenseQualLoading,
    error: tableLicenseQualError,
  } = useGetLicenseQualTable(
    currentPage,
    courseId,
    licenseStatus,
    debouncedSearchTerm,
    dateSearchStart,
    dateSearchEnd,
  );

  const {
    data: courseLicenseAvailableData,
    isLoading: courseLicenseAvailableLoading,
  } = useCourseLicenseAvailable();

  if (tableLicenseQualLoading || courseLicenseAvailableLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  const courseCategoryOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...courseLicenseAvailableData?.data.map((course) => ({
      label: course.course_name,
      value: course.id,
    })),
  ];

  const licenseStatusOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: 'ได้รับใบประกอบวิชาชีพ', value: 1 },
    { label: 'ยังไม่ได้รับใบประกอบวิชาชีพ', value: 0 },
  ];

  const handleCourseFilter = (value: string) => {
    setCourseId(value);
  };

  const handleLicenseStatusFilter = (value: string) => {
    setLicenseStatus(value);
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

  const columns = [
    {
      header: 'ไอดีนักเรียน',
      key: 'student_id',
      render: (row: LicenseQualTable) => row.student_id,
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (row: LicenseQualTable) => row.student_firstname_tha,
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (row: LicenseQualTable) => row.student_lastname_tha,
    },
    {
      header: 'หลักสูตร',
      key: 'course_name',
      render: (row: LicenseQualTable) => row.course_name,
    },
    {
      header: 'วันที่มีสิทธิการสอบใบประกอบวิชาชีพ',
      key: 'date_qual',
      render: (row: LicenseQualTable) =>
        format(row.date_qualified, 'dd/MM/yyyy'),
    },
    {
      header: 'สถานะการได้รับใบประกอบวิชาชีพ',
      key: 'is_completed',
      render: (row: LicenseQualTable) =>
        row.is_completed ? (
          <div className="text-green-500">ได้รับใบประกอบวิชาชีพ</div>
        ) : (
          <div className="text-red-500">ยังไม่ได้รับใบประกอบวิชาชีพ</div>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: LicenseQualTable) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log(row);
              setSelectedLicenseQualStudent(row);
              setIsEditLicenseQualModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedLicenseQualStudent(row);
              setIsDeleteLicenseQualModalOpen(true);
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
      <div className="mb-4 flex justify-start flex-wrap gap-4">
        <Filter
          value={courseId}
          onChange={handleCourseFilter}
          options={courseCategoryOptions}
          showIcon={true}
          placeholder="หลักสูตรทั้งหมด"
        />
        <Filter
          value={licenseStatus}
          onChange={handleLicenseStatusFilter}
          options={licenseStatusOptions}
          showIcon={false}
          placeholder="สถานะการสอบใบประกอบวิชาชีพ"
        />
        <div className="flex items-center gap-2 font-notoLoopThaiRegular">
          <span>วันที่ค้นหา</span>
          <Flatpickr
            value={dateSearchStart}
            onChange={handleDateSearchStart}
            placeholder="วันที่ค้นหาเริ่มต้น"
            options={{
              locale: Thai,
              dateFormat: 'd/m/Y',
              allowInput: true,
              enableTime: false,
            }}
          />
          <span>ถึง</span>
          <Flatpickr
            value={dateSearchEnd}
            onChange={handleDateSearchEnd}
            placeholder="วันที่ค้นหาสิ้นสุด"
            options={{
              locale: Thai,
              dateFormat: 'd/m/Y',
              allowInput: true,
              enableTime: false,
            }}
          />
          <button className="text-red-500" onClick={handleClearDateSearch}>
            ล้างค่า
          </button>
        </div>
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
          data={tableLicenseQualData?.data}
          columns={columns}
          isLoading={tableLicenseQualLoading}
        />
        <Pagination
          isFetching={tableLicenseQualLoading}
          currentPage={currentPage}
          totalPages={tableLicenseQualData?.data.last_page}
          from={tableLicenseQualData?.data.from}
          to={tableLicenseQualData?.data.to}
          total={tableLicenseQualData?.data.total}
          onPageChange={setCurrentPage}
          hasNextPage={!!tableLicenseQualData?.data.next_page_url}
          hasPrevPage={!!tableLicenseQualData?.data.prev_page_url}
        />
      </div>
      {selectedLicenseQualStudent && (
        <Modal
          isOpen={isEditLicenseQualModalOpen}
          onClose={() => setIsEditLicenseQualModalOpen(false)}
          title="แก้ไขข้อมูลวันที่มีสิทธิการสอบใบประกอบวิชาชีพ"
        >
          <EditLicenseQual
            selectedLicenseQualStudent={{
              id: selectedLicenseQualStudent.id,
              student_id: selectedLicenseQualStudent.student_id,
              course_id: selectedLicenseQualStudent.course_id,
              date_qualified: selectedLicenseQualStudent.date_qualified,
              firstname_tha: selectedLicenseQualStudent.student_firstname_tha,
              lastname_tha: selectedLicenseQualStudent.student_lastname_tha,
              course_name: selectedLicenseQualStudent.course_name,
            }}
            onSuccess={() => {
              setIsEditLicenseQualModalOpen(false);
              toast.success('อัพเดทข้อมูลเรียบร้อย');
              setSelectedLicenseQualStudent(null);
            }}
            onError={(error: ErrorResponse) => {
              console.log(error);
              toast.error(error.message);
            }}
          />
        </Modal>
      )}
      {selectedLicenseQualStudent && (
        <Modal
          isOpen={isDeleteLicenseQualModalOpen}
          onClose={() => setIsDeleteLicenseQualModalOpen(false)}
          title="ลบข้อมูลวันที่มีสิทธิการสอบใบประกอบวิชาชีพ"
        >
          <DeleteLicenseQual
            onClose={() => setIsDeleteLicenseQualModalOpen(false)}
            selectedLicenseQualStudent={{
              id: selectedLicenseQualStudent.id,
              student_id: selectedLicenseQualStudent.student_id,
              course_id: selectedLicenseQualStudent.course_id,
              firstname_tha: selectedLicenseQualStudent.student_firstname_tha,
              lastname_tha: selectedLicenseQualStudent.student_lastname_tha,
              date_qualified: selectedLicenseQualStudent.date_qualified,
            }}
            onSuccess={() => {
              setIsDeleteLicenseQualModalOpen(false);
              toast.success('ลบข้อมูลผู้มีสิทธิการสอบใบประกอบวิชาชีพเรียบร้อย');
              setSelectedLicenseQualStudent(null);
            }}
            onError={(error: ErrorResponse) => {
              console.log(error);
              toast.error(error.message);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default StudentLicenseQualManagePage;
