import React from 'react';
import { useState } from 'react';
import { Course } from '../../types/course';
import Spinner from '../../common/Spinner';
import Pagination from '../../components/Pagination';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Modal from '../../components/Modal';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import useDebounce from '../../hooks/useDebounce';
import IconEdit from '../../common/EditPen';
import { CourseWithCategory } from '../../types/course';
import { useCourseDataTable } from '../../hooks/api/useCourseData';
import { useCourseCategoryData } from '../../hooks/api/useCourseCategoryData';
import EditCoursePrice from './CoursePriceManageForm/EditCoursePrice';
import { toast } from 'react-toastify';
import { FileAdditionOne } from '../../common/FileAdditionOne';
import AddCoursePriceForm from './CoursePriceManageForm/AddCoursePriceForm';

const CoursePriceManagePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [courseCategoryId, setCourseCategoryId] = useState<string>('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isAddModal, setIsAddModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithCategory | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);

  const {
    data: apiResponse,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCourseDataTable({
    page,
    searchTerm: debouncedSearchTerm,
    courseCategoryId,
    onLoadComplete: () => setHasLoadedOnce(true),
  });

  const { data: courseCategoryData } = useCourseCategoryData();

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  const handleCourseCategoryFilter = (input: string) => {
    setCourseCategoryId(input);
    setPage(1);
  };

  const handleEditSuccess = () => {
    setIsEditModal(false);
    toast.success('แก้ไขราคาหลักสูตรสำเร็จ');
    refetch();
  };

  const handleEditError = () => {
    toast.error('เกิดข้อผิดพลาดในการแก้ไข');
  };

  const handleAddSuccess = () => {
    setIsAddModal(false);
    toast.success('เพิ่มราคาหลักสูตรสำเร็จ');
    refetch();
  };

  const handleAddError = () => {
    toast.error('เกิดข้อผิดพลาดในการเพิ่ม');
  };

  const columns = [
    {
      header: 'รหัสวิชา',
      key: 'course_code',
      render: (item: CourseWithCategory) => item.id || '-',
    },
    {
      header: 'ชื่อหลักสูตร',
      key: 'course_name',
      render: (item: CourseWithCategory) => item.course_name || '-',
    },
    {
      header: 'ประเภทหลักสูตร',
      key: 'course_category_id',
      render: (item: CourseWithCategory) =>
        item.course_category.category_name || '-',
    },
    {
      header: 'ราคา',
      key: 'price',
      render: (item: CourseWithCategory) => {
        const currentPrice =
          item.course_prices?.find((price) => price.date_end === null)?.price ||
          '0';
        return `${parseFloat(currentPrice).toLocaleString('th-TH')} บาท`;
      },
    },
    {
      header: 'จัดการ',
      key: 'manage',
      render: (item: CourseWithCategory) => (
        <div className="flex items-center gap-2">
          {item.course_prices.length > 0 ? (
            <button
              onClick={() => {
                setIsEditModal(true);
                setSelectedCourse(item);
              }}
            >
              <IconEdit className="cursor-pointer w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAddModal(true);
                setSelectedCourse(item);
              }}
            >
              <FileAdditionOne color="gray" className="cursor-pointer" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const paginationData = apiResponse?.data;

  const courseCategoryOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...(courseCategoryData?.data?.map((item) => ({
      label: item.category_name,
      value: item.id,
    })) || []),
  ];

  if (isLoading && !hasLoadedOnce)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Error</div>;

  return (
    <>
      <div className="mb-4 flex justify-between gap-4">
        <Search
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ค้นหาหลักสูตร..."
        />
        <Filter
          value={courseCategoryId}
          onChange={handleCourseCategoryFilter}
          options={courseCategoryOptions}
          placeholder="ประเภทหลักสูตร"
          className="w-48"
        />
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable<Course>
          data={paginationData}
          columns={columns}
          isLoading={isLoading || isFetching}
        />
        <Pagination
          isFetching={isFetching}
          currentPage={page}
          totalPages={paginationData?.last_page}
          from={paginationData?.from}
          to={paginationData?.to}
          total={paginationData?.total}
          onPageChange={setPage}
          hasNextPage={!!paginationData?.next_page_url}
          hasPrevPage={!!paginationData?.prev_page_url}
        />
      </div>

      <Modal
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        title="แก้ไขราคาหลักสูตร"
      >
        {selectedCourse && (
          <EditCoursePrice
            initialData={selectedCourse}
            onSuccess={handleEditSuccess}
            onError={handleEditError}
          />
        )}
      </Modal>

      <Modal
        isOpen={isAddModal}
        onClose={() => setIsAddModal(false)}
        title="เพิ่มราคาหลักสูตรใหม่"
      >
        <AddCoursePriceForm
          onSuccess={handleAddSuccess}
          onError={handleAddError}
          courseId={selectedCourse?.id}
        />
      </Modal>
    </>
  );
};

export default CoursePriceManagePage;
