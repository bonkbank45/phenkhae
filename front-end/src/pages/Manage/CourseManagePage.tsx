import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@material-tailwind/react/components/Button';
import Spinner from '../../common/Spinner';
import Pagination from '../../components/Pagination';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Modal from '../../components/Modal';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import useDebounce from '../../hooks/useDebounce';
import PlusCircle from '../../common/PlusCircle';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import { Course, ApiResponse, CourseWithCategory } from '../../types/course';
import { useCourseDataTable } from '../../hooks/api/useCourseData';
import { useCourseCategoryData } from '../../hooks/api/useCourseCategoryData';
import { useCourseBillCategoryData } from '../../hooks/api/useCourseBillCategoryData';
import EditCourse from '../Course/EditCourse';
import DeleteCourse from '../Course/DeleteCourse';

const CourseManagePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [courseCategoryId, setCourseCategoryId] = useState<string>('');
  const [courseBillCategoryId, setCourseBillCategoryId] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
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
    courseBillCategoryId,
    onLoadComplete: () => setHasLoadedOnce(true),
  });

  const { data: courseCategoryData } = useCourseCategoryData();
  const { data: courseBillCategoryData } = useCourseBillCategoryData();

  const handleAddCourse = () => {
    navigate('/courses/add');
  };

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  const handleCourseCategoryFilter = (input: string) => {
    setCourseCategoryId(input);
    setPage(1);
  };

  const handleCourseBillCategoryFilter = (input: string) => {
    setCourseBillCategoryId(input);
    setPage(1);
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
      header: 'ประเภทบิล',
      key: 'course_category_bill_id',
      render: (item: CourseWithCategory) =>
        item.course_category_bill.category_bill_name || '-',
    },
    {
      header: 'จัดการ',
      key: 'manage',
      render: (item: CourseWithCategory) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsEditModal(true);
              setSelectedCourse(item);
            }}
          >
            <IconEdit className="cursor-pointer w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsDeleteModal(true);
              setSelectedCourse(item);
            }}
          >
            <IconCrossCircled className="cursor-pointer w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const paginationData = apiResponse?.data;

  const courseCategoryOptions =
    courseCategoryData?.data?.map((item) => ({
      label: item.category_name,
      value: item.id,
    })) || [];

  const courseBillCategoryOptions =
    courseBillCategoryData?.data?.map((item) => ({
      label: item.category_bill_name,
      value: item.id,
    })) || [];

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
        <Filter
          showIcon={false}
          value={courseBillCategoryId}
          onChange={handleCourseBillCategoryFilter}
          options={courseBillCategoryOptions}
          placeholder="ประเภทบิล"
        />
        <Button
          variant="gradient"
          color="green"
          className="py-1 px-2 bg-green-500 flex items-center gap-2 font-notoRegular"
          onClick={handleAddCourse}
        >
          <PlusCircle className="w-10 h-10 p-1" />
          เพิ่มหลักสูตร
        </Button>
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
        title="แก้ไขรายละเอียดหลักสูตร"
      >
        {selectedCourse && (
          <EditCourse
            initialData={selectedCourse}
            onSuccess={() => {
              setIsEditModal(false);
              refetch();
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        title="ลบหลักสูตร"
      >
        {selectedCourse && (
          <DeleteCourse
            id={selectedCourse.id}
            courseName={selectedCourse.course_name}
            onSuccess={() => {
              setIsDeleteModal(false);
              refetch();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default CourseManagePage;
