import React, { useState } from 'react';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useCourseCategoryDataTable } from '../../hooks/api/basicData/useCourseCategoryData';
import IconEdit from '../../common/EditPen';
import CrossCircle from '../../common/CrossCircle';
import Search from '../../components/Search/Search';
import PlusCircle from '../../common/PlusCircle';
import Button from '@material-tailwind/react/components/Button';
import Spinner from '../../common/Spinner';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';
import useDebounce from '../../hooks/useDebounce';
import AddCourseCategoryForm from './CourseCategoryForm/AddCourseCategoryForm';
import DeleteCourseCategoryForm from './CourseCategoryForm/DeleteCourseCategoryForm';
import EditCourseCategoryForm from './CourseCategoryForm/EditCourseCategoryForm';

interface CourseCategory {
  id: number;
  category_name: string;
}

const CourseCategoryManagePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: categories, isLoading: isCategoriesLoading } =
    useCourseCategoryDataTable(debouncedSearch, currentPage);

  if (isCategoriesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const columns = [
    {
      header: 'ไอดี',
      key: 'id',
      render: (row: CourseCategory) => row.id,
    },
    {
      header: 'ชื่อประเภทหลักสูตร',
      key: 'category_name',
      render: (row: CourseCategory) => row.category_name,
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: CourseCategory) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedCategory(row);
              setIsDeleteModalOpen(true);
            }}
          >
            <CrossCircle />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center gap-2 mb-4">
        <Search
          placeholder="ค้นหาด้วยไอดีหรือชื่อหมวดหมู่"
          value={search}
          onChange={(e) => {
            setSearch(e);
          }}
        />
        <Button
          variant="gradient"
          color="green"
          className="py-1 px-2 bg-green-500 flex items-center gap-2 font-notoRegular"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusCircle className="w-10 h-10 p-1" />
          เพิ่มหมวดหมู่
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={categories?.data}
          columns={columns}
          isLoading={isCategoriesLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={categories?.data.last_page}
          onPageChange={setCurrentPage}
          from={categories?.data.from}
          to={categories?.data.to}
          total={categories?.data.total}
          hasNextPage={!!categories?.data.next_page_url}
          hasPrevPage={!!categories?.data.prev_page_url}
          isFetching={isCategoriesLoading}
        />
      </div>
      {selectedCategory && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setSelectedCategory(null);
              setIsEditModalOpen(false);
            }}
            title="แก้ไขประเภทหลักสูตร"
          >
            <EditCourseCategoryForm
              initialData={selectedCategory}
              onSuccess={() => {
                toast.success('แก้ไขประเภทหลักสูตรสำเร็จ');
                setIsEditModalOpen(false);
              }}
              onError={(error) => {
                toast.error(
                  'แก้ไขประเภทหลักสูตรไม่สำเร็จ ' + error.response.data.message,
                );
                console.error(error);
              }}
            />
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setSelectedCategory(null);
              setIsDeleteModalOpen(false);
            }}
            title="ลบประเภทหลักสูตร"
          >
            <DeleteCourseCategoryForm
              selectedCourseCategory={selectedCategory}
              onSuccess={() => {
                toast.success('ลบประเภทหลักสูตรสำเร็จ');
                setIsDeleteModalOpen(false);
              }}
              onError={(error) => {
                toast.error(
                  'ลบประเภทหลักสูตรไม่สำเร็จ ' + error.response.data.message,
                );
                console.error(error);
              }}
              onClose={() => {
                setSelectedCategory(null);
                setIsDeleteModalOpen(false);
              }}
            />
          </Modal>
        </>
      )}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setSelectedCategory(null);
          setIsAddModalOpen(false);
        }}
        title="เพิ่มประเภทหลักสูตร"
      >
        <AddCourseCategoryForm
          onSuccess={() => {
            toast.success('เพิ่มประเภทหลักสูตรสำเร็จ');
            setIsAddModalOpen(false);
          }}
          onError={(error) => {
            toast.error(
              'เพิ่มประเภทหลักสูตรไม่สำเร็จ' + error.response.data.message,
            );
            console.error(error);
          }}
        />
      </Modal>
    </>
  );
};

export default CourseCategoryManagePage;
