import React, { useState } from 'react';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useMaritalDataTable } from '../../hooks/api/basicData/useMaritalData';
import IconEdit from '../../common/EditPen';
import CrossCircle from '../../common/CrossCircle';
import Search from '../../components/Search/Search';
import PlusCircle from '../../common/PlusCircle';
import Button from '@material-tailwind/react/components/Button';
import Spinner from '../../common/Spinner';
import Modal from '../../components/Modal';
import AddMaritalStatusForm from './MaritalStatusForm/AddMaritalStatusForm';
import EditMaritalStatusForm from './MaritalStatusForm/EditMaritalStatusForm';
import DeleteMaritalStatusForm from './MaritalStatusForm/DeleteMaritalStatusForm';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';
import useDebounce from '../../hooks/useDebounce';

interface MaritalStatus {
  id: number;
  marital_name: string;
}

const MaritalStatusManagePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMaritalStatus, setSelectedMaritalStatus] =
    useState<MaritalStatus | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { data: maritalStatuses, isLoading: isMaritalStatusesLoading } =
    useMaritalDataTable(debouncedSearch, currentPage);

  if (isMaritalStatusesLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  const columns = [
    {
      header: 'ไอดี',
      key: 'id',
      render: (row: MaritalStatus) => row.id,
    },
    {
      header: 'สถานะภาพ',
      key: 'marital_name',
      render: (row: MaritalStatus) => row.marital_name,
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: MaritalStatus) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedMaritalStatus(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedMaritalStatus(row);
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
          placeholder="ค้นหาด้วยไอดีหรือชื่อสถานภาพ"
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
          เพิ่มสถานะ
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={maritalStatuses?.data}
          columns={columns}
          isLoading={isMaritalStatusesLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={maritalStatuses?.data.last_page}
          onPageChange={setCurrentPage}
          from={maritalStatuses?.data.from}
          to={maritalStatuses?.data.to}
          total={maritalStatuses?.data.total}
          hasNextPage={!!maritalStatuses?.data.next_page_url}
          hasPrevPage={!!maritalStatuses?.data.prev_page_url}
          isFetching={isMaritalStatusesLoading}
        />
      </div>
      {selectedMaritalStatus && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedMaritalStatus(null);
            }}
            title="แก้ไขสถานะ"
          >
            <EditMaritalStatusForm
              initialData={selectedMaritalStatus}
              onSuccess={() => {
                toast.success('แก้ไขสถานะสำเร็จ');
                setIsEditModalOpen(false);
                setSelectedMaritalStatus(null);
              }}
              onError={(error: ErrorResponse) => {
                toast.error('แก้ไขสถานะไม่สำเร็จ ' + error.message);
              }}
            />
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedMaritalStatus(null);
            }}
            title="ลบสถานะ"
          >
            <DeleteMaritalStatusForm
              selectedMaritalStatus={selectedMaritalStatus}
              onSuccess={() => {
                toast.success('ลบสถานะสำเร็จ');
                setIsDeleteModalOpen(false);
                setSelectedMaritalStatus(null);
              }}
              onError={(error: ErrorResponse) => {
                console.error(error);
                if (
                  error.response.data.message?.includes(
                    'foreign key constraint fails',
                  )
                ) {
                  toast.error(
                    'ไม่สามารถลบสถานะนี้ได้ เนื่องจากมีข้อมูลนักเรียนที่ใช้สถานะนี้อยู่',
                  );
                } else {
                  toast.error(
                    'เกิดข้อผิดพลาดในการลบสถานะ กรุณาลองใหม่อีกครั้ง',
                  );
                }
              }}
              onClose={() => setIsDeleteModalOpen(false)}
            />
          </Modal>
        </>
      )}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="เพิ่มสถานะ"
      >
        <AddMaritalStatusForm
          onSuccess={() => {
            toast.success('เพิ่มสถานะสำเร็จ');
            setIsAddModalOpen(false);
          }}
          onError={(error: ErrorResponse) => {
            toast.error('เพิ่มสถานะไม่สำเร็จ ' + error.response.data.message);
          }}
        />
      </Modal>
    </>
  );
};

export default MaritalStatusManagePage;
