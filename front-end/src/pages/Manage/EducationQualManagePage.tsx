import React, { useState } from 'react';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useEducationQualDataTable } from '../../hooks/api/basicData/useEducationQualData';
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
import AddEducationQualForm from './EducationQualForm/AddEducationQualForm';
import EditEducationQualForm from './EducationQualForm/EditEducationQualForm';
import DeleteEducationQualForm from './EducationQualForm/DeleteEducationQualForm';

interface EducationQual {
  id: number;
  edu_qual_name: string;
  edu_qual_eng: string;
}

const EducationQualManagePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEducationQual, setSelectedEducationQual] =
    useState<EducationQual | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: educationQualData, isLoading: educationQualLoading } =
    useEducationQualDataTable(debouncedSearch, currentPage);

  if (educationQualLoading) {
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
      render: (row: EducationQual) => row.id,
    },
    {
      header: 'วุฒิการศึกษา',
      key: 'edu_qual_name',
      render: (row: EducationQual) => row.edu_qual_name,
    },
    {
      header: 'วุฒิการศึกษา (อังกฤษ)',
      key: 'edu_qual_eng',
      render: (row: EducationQual) =>
        row.edu_qual_eng ? row.edu_qual_eng : '-',
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: EducationQual) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedEducationQual(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedEducationQual(row);
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
          placeholder="ค้นหาด้วยไอดีหรือชื่อวุฒิการศึกษา"
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
          เพิ่มวุฒิการศึกษา
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={educationQualData?.data}
          columns={columns}
          isLoading={educationQualLoading}
        />
        <Pagination
          isFetching={educationQualLoading}
          currentPage={currentPage}
          totalPages={educationQualData?.data.last_page}
          from={educationQualData?.data.from}
          to={educationQualData?.data.to}
          total={educationQualData?.data.total}
          onPageChange={setCurrentPage}
          hasNextPage={!!educationQualData?.data.next_page_url}
          hasPrevPage={!!educationQualData?.data.prev_page_url}
        />
      </div>
      {selectedEducationQual && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="แก้ไขวุฒิการศึกษา"
          >
            <EditEducationQualForm
              initialData={selectedEducationQual}
              onSuccess={() => {
                toast.success('แก้ไขวุฒิการศึกษาสำเร็จ');
                setIsEditModalOpen(false);
              }}
              onError={(error) => {
                toast.error('แก้ไขวุฒิการศึกษาไม่สำเร็จ ' + error.message);
              }}
            />
          </Modal>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="ลบวุฒิการศึกษา"
          >
            <DeleteEducationQualForm
              selectedEducationQual={selectedEducationQual}
              onSuccess={() => {
                toast.success('ลบวุฒิการศึกษาสำเร็จ');
                setIsDeleteModalOpen(false);
              }}
              onError={(error) => {
                if (
                  error.response.data.message?.includes(
                    'foreign key constraint fails',
                  )
                ) {
                  toast.error(
                    'ไม่สามารถลบวุฒิการศึกษานี้ได้ เนื่องจากมีข้อมูลนักเรียนที่ใช้วุฒิการศึกษานี้อยู่',
                  );
                } else {
                  toast.error(
                    'ลบวุฒิการศึกษาไม่สำเร็จ ' + error.response.data.message,
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
        title="เพิ่มวุฒิการศึกษา"
      >
        <AddEducationQualForm
          onSuccess={() => {
            toast.success('เพิ่มวุฒิการศึกษาสำเร็จ');
            setIsAddModalOpen(false);
          }}
          onError={(error) => {
            toast.error('เพิ่มวุฒิการศึกษาไม่สำเร็จ ' + error.message);
          }}
        />
      </Modal>
    </>
  );
};

export default EducationQualManagePage;
