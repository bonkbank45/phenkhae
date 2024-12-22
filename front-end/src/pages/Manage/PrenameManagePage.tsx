import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../common/Spinner';
import axios from 'axios';
import Pagination from '../../components/Pagination';

import PaginatedTable from '../../components/Tables/PaginatedTable';
import EditPrename from '../Prename/EditPrename';
import DeletePrename from '../Prename/DeletePrename';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import Modal from '../../components/Modal';

interface Prename {
  id: number;
  prename_tha: string;
  prename_eng: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
}

const Prename = () => {
  const [page, setPage] = useState(1);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedPrename, setSelectedPrename] = useState<Prename | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['prename', page],
    queryFn: async () => {
      const { data } = await axios
        .create({
          baseURL: 'http://localhost:8000/api',
          withCredentials: true,
        })
        .get(`prename/table?page=${page}`);
      setHasLoadedOnce(true);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const columns = [
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

  if (isLoading && !hasLoadedOnce)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Error</div>;

  return (
    <>
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
