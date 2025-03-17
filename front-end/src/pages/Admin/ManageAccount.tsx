import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { useUserDataTable } from '../../hooks/api/admin/useUserData';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search/Search';
import IconEdit from '../../common/EditPen';
import CrossCircle from '../../common/CrossCircle';
import Spinner from '../../common/Spinner';
import useDebounce from '../../hooks/useDebounce';
import DeleteEmployeeForm from './Form/DeleteEmployeeForm';
import EditEmployeeForm from './Form/EditEmployeeForm';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  profile_img: string | null;
}

const ManageAccount = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      header: 'รูปภาพ',
      key: 'profile_image',
      render: (row: User) => (
        <>
          {row.profile_img !== null ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/storage/profiles/users/${
                row.profile_img
              }.jpg?t=${new Date().getTime()}`}
              alt="Profile picture"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <img
              src={`${
                import.meta.env.VITE_API_URL
              }/storage/profiles/users/default-profile.png`}
              alt="Profile picture"
              className="w-10 h-10 rounded-full"
            />
          )}
        </>
      ),
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
      header: 'วันที่สร้าง',
      key: 'created_at',
      render: (row: User) => format(new Date(row.created_at), 'dd/MM/yyyy'),
    },
    {
      header: 'วันที่อัพเดท',
      key: 'updated_at',
      render: (row: User) => format(new Date(row.updated_at), 'dd/MM/yyyy'),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (row: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedUser(row);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => {
              setSelectedUser(row);
              setIsDeleteModalOpen(true);
            }}
          >
            <CrossCircle />
          </button>
        </div>
      ),
    },
  ];

  const filterEmployee =
    userData?.data.data.filter((user: User) => {
      return user.role_id !== 1;
    }) || [];

  const formatUser = {
    data: filterEmployee,
    current_page: userData?.data.current_page,
    first_page_url: userData?.data.first_page_url,
    from: userData?.data.from,
    last_page: userData?.data.last_page,
    last_page_url: userData?.data.last_page_url,
    next_page_url: userData?.data.next_page_url,
    path: userData?.data.path,
    per_page: userData?.data.per_page,
    prev_page_url: userData?.data.prev_page_url,
    to: userData?.data.to,
    total: userData?.data.total,
    links: userData?.data.links,
  };

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
          data={formatUser}
          columns={columns}
          isLoading={userLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={userData?.data.last_page}
          onPageChange={setCurrentPage}
          from={userData?.data.from}
          to={userData?.data.to - 1}
          total={userData?.data.total - 1}
          hasNextPage={!!userData?.data.next_page_url}
          hasPrevPage={!!userData?.data.prev_page_url}
          isFetching={userLoading}
        />
      </div>
      {selectedUser && (
        <>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setSelectedUser(null);
              setIsDeleteModalOpen(false);
            }}
            title="ลบข้อมูลพนักงาน"
          >
            <DeleteEmployeeForm
              selectedEmployee={selectedUser}
              onSuccess={() => {
                toast.success('ลบข้อมูลพนักงานสำเร็จ');
                setSelectedUser(null);
                setIsDeleteModalOpen(false);
              }}
              onError={(error) => {
                toast.error(
                  'ลบข้อมูลพนักงานไม่สำเร็จ' + error.response?.data?.message,
                );
              }}
              onClose={() => {
                setSelectedUser(null);
                setIsDeleteModalOpen(false);
              }}
            />
          </Modal>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setSelectedUser(null);
              setIsEditModalOpen(false);
            }}
            title="แก้ไขข้อมูลพนักงาน"
          >
            <EditEmployeeForm
              initialData={selectedUser}
              onSuccess={() => {
                toast.success('แก้ไขข้อมูลพนักงานสำเร็จ');
                setSelectedUser(null);
                setIsEditModalOpen(false);
              }}
              onError={(error) => {
                toast.error(
                  'แก้ไขข้อมูลพนักงานไม่สำเร็จ ' +
                    error.response?.data?.message,
                );
              }}
            />
          </Modal>
        </>
      )}
    </>
  );
};

export default ManageAccount;
