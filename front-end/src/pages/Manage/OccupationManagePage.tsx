import React, { useState } from 'react';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useOccupationDataTable } from '../../hooks/api/basicData/useOccupationData';
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
import AddOccupationForm from './OccupationForm/AddOccupationForm';
import EditOccupationForm from './OccupationForm/EditOccupationForm';
import DeleteOccupationForm from './OccupationForm/DeleteOccupationForm';

interface Occupation {
  id: number;
  occupation_name: string;
}

const OccupationManagePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOccupation, setSelectedOccupation] =
    useState<Occupation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { data: occupations, isLoading: isOccupationsLoading } =
    useOccupationDataTable(debouncedSearch, currentPage);

  if (isOccupationsLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  console.log(occupations?.data);

  const columns = [
    {
      header: 'ไอดี',
      key: 'id',
      render: (row: Occupation) => row.id,
    },
    {
      header: 'อาชีพ',
      key: 'occupation_name',
      render: (row: Occupation) => row.occupation_name,
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: Occupation) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedOccupation(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedOccupation(row);
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
          placeholder="ค้นหาด้วยไอดีหรือชื่ออาชีพ"
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
          เพิ่มอาชีพ
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={occupations?.data}
          columns={columns}
          isLoading={isOccupationsLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={occupations?.data.last_page}
          onPageChange={setCurrentPage}
          from={occupations?.data.from}
          to={occupations?.data.to}
          total={occupations?.data.total}
          hasNextPage={!!occupations?.data.next_page_url}
          hasPrevPage={!!occupations?.data.prev_page_url}
          isFetching={isOccupationsLoading}
        />
      </div>
      {selectedOccupation && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setSelectedOccupation(null);
              setIsEditModalOpen(false);
            }}
            title="แก้ไขอาชีพ"
          >
            <EditOccupationForm
              initialData={selectedOccupation}
              onSuccess={() => {
                toast.success('แก้ไขอาชีพสำเร็จ');
                setSelectedOccupation(null);
                setIsEditModalOpen(false);
              }}
              onError={(error) => console.error(error)}
            />
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setSelectedOccupation(null);
              setIsDeleteModalOpen(false);
            }}
            title="ลบอาชีพ"
          >
            <DeleteOccupationForm
              selectedOccupation={selectedOccupation}
              onSuccess={() => {
                toast.success('ลบอาชีพสำเร็จ');
                setSelectedOccupation(null);
                setIsDeleteModalOpen(false);
              }}
              onError={(error) => {
                console.error(error);
                if (
                  error.response.data.message?.includes(
                    'foreign key constraint fails',
                  )
                ) {
                  toast.error(
                    'ไม่สามารถลบอาชีพนี้ได้ เนื่องจากมีข้อมูลนักเรียนที่ใช้อาชีพนี้อยู่',
                  );
                } else {
                  toast.error(
                    'เกิดข้อผิดพลาดในการลบอาชีพ กรุณาลองใหม่อีกครั้ง',
                  );
                }
              }}
              onClose={() => {
                setSelectedOccupation(null);
                setIsDeleteModalOpen(false);
              }}
            />
          </Modal>
        </>
      )}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedOccupation(null);
        }}
        title="เพิ่มอาชีพ"
      >
        <AddOccupationForm
          onSuccess={() => {
            toast.success('เพิ่มอาชีพสำเร็จ');
            setIsAddModalOpen(false);
          }}
          onError={(error: ErrorResponse) => {
            toast.error('เพิ่มอาชีพไม่สำเร็จ ' + error.response.data.message);
          }}
        />
      </Modal>
    </>
  );
};

export default OccupationManagePage;
