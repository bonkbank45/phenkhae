import React, { useState } from 'react';
import { useUserDataTable } from '../../hooks/api/admin/useUserData';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search/Search';
import IconEdit from '../../common/EditPen';
import CrossCircle from '../../common/CrossCircle';
import Spinner from '../../common/Spinner';
import useDebounce from '../../hooks/useDebounce';

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

const ManageAccount = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: userData, isLoading: userLoading } = useUserDataTable(
    debouncedSearch,
    currentPage,
  );

  if (userLoading) {
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
      render: (row: User) => row.id,
    },
    {
      header: 'อีเมล',
      key: 'email',
      render: (row: User) => row.email,
    },
    {
      header: 'ชื่อ',
      key: 'firstname',
      render: (row: User) => row.firstname,
    },
    {
      header: 'นามสกุล',
      key: 'lastname',
      render: (row: User) => row.lastname,
    },
    {
      header: 'ตำแหน่ง',
      key: 'role_id',
      render: (row: User) => row.role_id,
    },
    {
      header: 'วันที่สร้าง',
      key: 'created_at',
      render: (row: User) =>
        new Date(row.created_at).toLocaleDateString('th-TH'),
    },
    {
      header: 'วันที่อัพเดท',
      key: 'updated_at',
      render: (row: User) =>
        new Date(row.updated_at).toLocaleDateString('th-TH'),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              /* TODO: Implement edit */
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              /* TODO: Implement delete */
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
          placeholder="ค้นหาด้วยอีเมลหรือชื่อ"
          value={search}
          onChange={(e) => setSearch(e)}
        />
      </div>
      <div className="bg-white rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <PaginatedTable
          data={userData?.data}
          columns={columns}
          isLoading={userLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={userData?.data.last_page}
          onPageChange={setCurrentPage}
          from={userData?.data.from}
          to={userData?.data.to}
          total={userData?.data.total}
          hasNextPage={!!userData?.data.next_page_url}
          hasPrevPage={!!userData?.data.prev_page_url}
          isFetching={userLoading}
        />
      </div>
    </>
  );
};

export default ManageAccount;
