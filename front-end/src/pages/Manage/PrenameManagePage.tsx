import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '@material-tailwind/react/components/Button';
import Spinner from '../../common/Spinner';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import EditPrename from '../Prename/EditPrename';
import DeletePrename from '../Prename/DeletePrename';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import Modal from '../../components/Modal';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import useDebounce from '../../hooks/useDebounce';
import PlusCircle from '../../common/PlusCircle';

interface Prename {
  id: number;
  prename_tha: string;
  prename_eng: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
  show_status: number;
}

const Prename = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatus, setShowStatus] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedPrename, setSelectedPrename] = useState<Prename | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['prename', page, debouncedSearchTerm, showStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(showStatus && { show_status: showStatus }),
      });
      const { data } = await axios
        .create({
          baseURL: 'http://localhost:8000/api',
          withCredentials: true,
        })
        .get(`prename/table?${params}`);
      setHasLoadedOnce(true);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const handleAddPrename = async () => {
    navigate('/prename/add');
  };

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  const handleStatusFilter = (input: string) => {
    setShowStatus(input);
    setPage(1);
  };

  const columns = [
    {
      header: 'ไอดี',
      key: 'id',
      render: (item: Prename) => item.id || '-',
    },
    {
      header: 'คำนำหน้าชื่อไทย',
      key: 'prename_tha',
      render: (item: Prename) => item.prename_tha || '-',
    },
    {
      header: 'คำนำหน้าชื่ออังกฤษ',
      key: 'prename_eng',
      render: (item: Prename) => item.prename_eng || '-',
    },
    {
      header: 'คำนำหน้าชื่อไทยสั้น',
      key: 'prename_short_tha',
      render: (item: Prename) => item.prename_short_tha || '-',
    },
    {
      header: 'คำนำหน้าชื่ออังกฤษสั้น',
      key: 'prename_short_eng',
      render: (item: Prename) => item.prename_short_eng || '-',
    },
    {
      header: 'การแสดงผล',
      key: 'show_status',
      render: (item: Prename) =>
        item.show_status ? (
          <span className="text-green-500">แสดง</span>
        ) : (
          <span className="text-red-500">ไม่แสดง</span>
        ),
    },
    {
      header: 'จัดการ',
      key: 'manage',
      render: (item: Prename) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsEditModal(true);
              setSelectedPrename(item);
            }}
          >
            <IconEdit className="cursor-pointer w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsDeleteModal(true);
              setSelectedPrename(item);
            }}
          >
            <IconCrossCircled className="cursor-pointer w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { label: 'แสดง', value: 1 },
    { label: 'ไม่แสดง', value: 0 },
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
          placeholder="ค้นหาคำนำหน้าชื่อ..."
        />
        <Filter
          value={showStatus}
          onChange={handleStatusFilter}
          options={statusOptions}
          placeholder="สถานะทั้งหมด"
        />
        <Button
          variant="gradient"
          color="green"
          className="py-1 px-2 bg-green-500 flex items-center gap-2 font-notoRegular"
          onClick={handleAddPrename}
        >
          <PlusCircle className="w-10 h-10 p-1" />
          เพิ่มคำนำหน้าชื่อ
        </Button>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable<Prename>
          data={data}
          columns={columns}
          isLoading={isLoading || isFetching}
        />
        <Pagination
          isFetching={isFetching}
          currentPage={page}
          totalPages={data?.last_page}
          from={data?.from}
          to={data?.to}
          total={data?.total}
          onPageChange={setPage}
          hasNextPage={!!data?.next_page_url}
          hasPrevPage={!!data?.prev_page_url}
        />
      </div>

      <Modal
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        title="แก้ไขคำนำหน้าชื่อ"
      >
        {selectedPrename && (
          <EditPrename
            initialData={selectedPrename}
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
        title="Delete Prename"
      >
        {selectedPrename && (
          <DeletePrename
            id={selectedPrename.id}
            prenameThai={selectedPrename.prename_tha}
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

export default Prename;
