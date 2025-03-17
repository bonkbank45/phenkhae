import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useBillCategoryDataTable } from '../../hooks/api/basicData/useBillCategoryData';
import IconEdit from '../../common/EditPen';
import CrossCircle from '../../common/CrossCircle';
import Search from '../../components/Search/Search';
import PlusCircle from '../../common/PlusCircle';
import Button from '@material-tailwind/react/components/Button';
import Spinner from '../../common/Spinner';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import useDebounce from '../../hooks/useDebounce';
import AddBillCategoryForm from './BillCategoryForm/AddBillCategoryForm';
import EditBillCategoryForm from './BillCategoryForm/EditBillCategoryForm';
import DeleteBillCategoryForm from './BillCategoryForm/DeleteBillCategoryForm';

interface BillCategory {
  id: number;
  category_bill_name: string;
}

const BillCategoryManagePage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<BillCategory | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: categories, isLoading: isCategoriesLoading } =
    useBillCategoryDataTable(debouncedSearch, currentPage);

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
      render: (row: BillCategory) => row.id || '-',
    },
    {
      header: 'ชื่อประเภทบิล',
      key: 'category_bill_name',
      render: (row: BillCategory) => row.category_bill_name || '-',
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: BillCategory) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setSelectedCategory(row);
                setIsDeleteModalOpen(true);
              }}
          >
              <CrossCircle />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center gap-2 mb-4">
        <Search
          placeholder="ค้นหาด้วยไอดีหรือชื่อประเภทบิล"
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
          เพิ่มประเภทบิล
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
              setIsEditModalOpen(false);
              setSelectedCategory(null);
            }}
            title="แก้ไขประเภทบิล"
          >
            <EditBillCategoryForm
              initialData={selectedCategory}
              onSuccess={() => {
                toast.success('แก้ไขประเภทบิลสำเร็จ');
                setIsEditModalOpen(false);
                setSelectedCategory(null);
              }}
              onError={(error) => {
                toast.error(
                  'แก้ไขประเภทบิลไม่สำเร็จ ' + error.response.data.message,
                );
                console.error(error);
              }}
            />
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedCategory(null);
            }}
            title="ลบประเภทบิล"
          >
            <DeleteBillCategoryForm
              selectedBillCategory={selectedCategory}
              onSuccess={() => {
                toast.success('ลบประเภทบิลสำเร็จ');
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
              onError={(error) => {
                toast.error(
                  'ลบประเภทบิลไม่สำเร็จ ' + error.response.data.message,
                );
                console.error(error);
              }}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
            />
          </Modal>
        </>
      )}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCategory(null);
        }}
        title="เพิ่มประเภทบิล"
      >
        <AddBillCategoryForm
          onSuccess={() => {
            setIsAddModalOpen(false);
            setSelectedCategory(null);
          }}
          onError={(error) => {
            console.error('Add Bill Category Error', error);
          }}
        />
      </Modal>
    </>
  );
};

export default BillCategoryManagePage;
