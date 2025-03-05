import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import Filter from '../../../components/Filter/Filter';
import Spinner from '../../../common/Spinner';
import { useGetLicenseQualTable } from '../../../hooks/api/useLicenseQual';
import { format } from 'date-fns';
import { LicenseQualTable } from '../../../types/license_qual';
import { useCourseLicenseAvailable } from '../../../hooks/api/useCourseData';
import DateRangePicker from '../../../components/DateRange/DateRangePicker';
import { Button } from '@material-tailwind/react';
import { useGeneratePdfStudentQual } from '../../../hooks/api/usePdfData';
import { ErrorResponse } from '../../../types/error_response';
import { useNavigate } from 'react-router-dom';
import IconArrowLeft from '../../../common/ArrowLeft';

const StudentLicensePdfPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [courseId, setCourseId] = useState<string>('all');
  const [licenseStatus, setLicenseStatus] = useState<string>('all');
  const [dateSearchStart, setDateSearchStart] = useState<Date | null>(null);
  const [dateSearchEnd, setDateSearchEnd] = useState<Date | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { mutate: generatePdfStudentQual } = useGeneratePdfStudentQual();

  const { data: tableLicenseQualData, isLoading: tableLicenseQualLoading } =
    useGetLicenseQualTable(
      currentPage,
      courseId,
      licenseStatus,
      '',
      dateSearchStart,
      dateSearchEnd,
      courseId === 'all' || courseId === '' ? false : true,
    );

  const {
    data: courseLicenseAvailableData,
    isLoading: courseLicenseAvailableLoading,
  } = useCourseLicenseAvailable();

  if (courseLicenseAvailableLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const courseCategoryOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...(courseLicenseAvailableData?.data.map((course) => ({
      label: course.course_name,
      value: course.id,
    })) || []),
  ];

  const licenseStatusOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: 'ได้รับใบประกอบวิชาชีพ', value: '1' },
    { label: 'ยังไม่ได้รับใบประกอบวิชาชีพ', value: '0' },
  ];

  const columns = [
    {
      header: 'เลือก',
      key: 'select',
      render: (row: LicenseQualTable) => (
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
      header: 'วันที่มีสิทธิการสอบ',
      key: 'date_qual',
      render: (row: LicenseQualTable) =>
        format(new Date(row.date_qualified), 'dd/MM/yyyy'),
    },
    {
      header: 'สถานะ',
      key: 'is_completed',
      render: (row: LicenseQualTable) =>
        row.is_completed ? (
          <div className="text-green-500">ได้รับใบประกอบวิชาชีพ</div>
        ) : (
          <div className="text-red-500">ยังไม่ได้รับใบประกอบวิชาชีพ</div>
        ),
    },
  ];

  const handlePrint = () => {
    if (selectedStudents.length === 0) {
      toast.error('กรุณาเลือกนักเรียนอย่างน้อย 1 คน');
      return;
    }

    const payload = {
      student_qual_ids: selectedStudents,
    };

    console.log(payload);

    generatePdfStudentQual(payload, {
      onSuccess: (response) => {
        console.log(response);
        toast.success('สร้างไฟล์ PDF สำเร็จ');
      },
      onError: (error: ErrorResponse) => {
        toast.error(error.message);
      },
    });
  };

  const handleCourseIdChange = (value: string) => {
    setSelectedStudents([]);
    if (value === 'all') {
      setCourseId('all');
    } else {
      setCourseId(value);
    }
  };

  const getTableData = () => {
    if (courseId === 'all') {
      return emptyTableData;
    }
    return tableLicenseQualData?.data || emptyTableData;
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
        onClick={() => {
          navigate(-1);
        }}
      >
        <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />{' '}
        <span className="text-black dark:text-white">ย้อนกลับ</span>
      </Button>
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-notoExtraBold">
            พิมพ์รายงาน PDF
            รายชื่อนักเรียนที่มีคุณสมบัติมีสิทธิสอบใบประกอบวิชาชีพ
          </h1>
        </div>

        <div className="mb-4 flex flex-wrap gap-4">
          <Filter
            value={courseId}
            onChange={handleCourseIdChange}
            options={courseCategoryOptions}
            showIcon={true}
            placeholder="เลือกหลักสูตร"
          />
          <Filter
            value={licenseStatus}
            onChange={setLicenseStatus}
            options={licenseStatusOptions}
            showIcon={false}
            placeholder="เลือกสถานะ"
          />
          <DateRangePicker
            startDate={dateSearchStart}
            endDate={dateSearchEnd}
            onStartDateChange={setDateSearchStart}
            onEndDateChange={setDateSearchEnd}
            onClear={() => {
              setDateSearchStart(null);
              setDateSearchEnd(null);
            }}
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

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <PaginatedTable
            data={getTableData()}
            columns={columns}
            isLoading={tableLicenseQualLoading}
          />
          <Pagination
            isFetching={tableLicenseQualLoading}
            currentPage={currentPage}
            totalPages={getTableData().last_page || 1}
            from={getTableData().from || 0}
            to={getTableData().to || 0}
            total={getTableData().total || 0}
            onPageChange={setCurrentPage}
            hasNextPage={!!getTableData().next_page_url}
            hasPrevPage={!!getTableData().prev_page_url}
          />
        </div>
      </div>
    </>
  );
};

export default StudentLicensePdfPage;
