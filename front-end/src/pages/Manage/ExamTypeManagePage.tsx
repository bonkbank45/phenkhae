import React, { useState } from 'react';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useExamTypeDataTable } from '../../hooks/api/basicData/useExamTypeData';
import IconEdit from '../../common/EditPen';
import CrossCircle from '../../common/CrossCircle';
import Search from '../../components/Search/Search';
import PlusCircle from '../../common/PlusCircle';
import Button from '@material-tailwind/react/components/Button';
import Spinner from '../../common/Spinner';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import useDebounce from '../../hooks/useDebounce';
import AddExamTypeForm from './ExamTypeForm/AddExamTypeForm';
import EditExamTypeForm from './ExamTypeForm/EditExamTypeForm';
import DeleteExamTypeForm from './ExamTypeForm/DeleteExamTypeForm';

interface ExamType {
  id: number;
  exam_type_name: string;
}

const ExamTypeManagePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExamType, setSelectedExamType] = useState<ExamType | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: examTypes, isLoading: isExamTypesLoading } =
    useExamTypeDataTable(debouncedSearch, currentPage);

  if (isExamTypesLoading) {
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
      render: (row: ExamType) => row.id,
    },
    {
      header: 'ชื่อประเภทการสอบ',
      key: 'exam_type_name',
      render: (row: ExamType) => row.exam_type_name,
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: ExamType) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedExamType(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedExamType(row);
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
          placeholder="ค้นหาด้วยไอดีหรือชื่อประเภทการสอบ"
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
          เพิ่มประเภทการสอบ
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={examTypes?.data}
          columns={columns}
          isLoading={isExamTypesLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={examTypes?.data.last_page}
          onPageChange={setCurrentPage}
          from={examTypes?.data.from}
          to={examTypes?.data.to}
          total={examTypes?.data.total}
          hasNextPage={!!examTypes?.data.next_page_url}
          hasPrevPage={!!examTypes?.data.prev_page_url}
          isFetching={isExamTypesLoading}
        />
      </div>
      {selectedExamType && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="แก้ไขประเภทการสอบ"
          >
            <EditExamTypeForm
              initialData={selectedExamType}
              onSuccess={() => {
                toast.success('แก้ไขประเภทการสอบสำเร็จ');
                setIsEditModalOpen(false);
              }}
              onError={(error) => {
                toast.error(
                  'แก้ไขประเภทการสอบไม่สำเร็จ' + error.response?.data?.message,
                );
              }}
            />
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="ลบประเภทการสอบ"
          >
            <DeleteExamTypeForm
              selectedExamType={selectedExamType}
              onSuccess={() => {
                toast.success('ลบประเภทการสอบสำเร็จ');
                setIsDeleteModalOpen(false);
              }}
              onError={(error) => {
                toast.error(
                  'ลบประเภทการสอบไม่สำเร็จ' + error.response?.data?.message,
                );
              }}
              onClose={() => setIsDeleteModalOpen(false)}
            />
          </Modal>
        </>
      )}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="เพิ่มประเภทการสอบ"
      >
        <AddExamTypeForm
          onSuccess={() => {
            toast.success('เพิ่มประเภทการสอบสำเร็จ');
            setIsAddModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onError={(error) => {
            toast.error(
              'เพิ่มประเภทการสอบไม่สำเร็จ' + error.response?.data?.message,
            );
            console.log(error);
          }}
        />
      </Modal>
    </>
  );
};

export default ExamTypeManagePage;
