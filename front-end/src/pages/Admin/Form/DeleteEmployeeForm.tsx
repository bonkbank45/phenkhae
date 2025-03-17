import React from 'react';
import { useDeleteUser } from '../../../hooks/api/admin/useUserData';
import { ErrorResponse } from '../../../types/error_response';

interface Employee {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

interface DeleteEmployeeProps {
  selectedEmployee: Employee;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
  onClose: () => void;
}

const DeleteEmployeeForm = ({
  selectedEmployee,
  onSuccess,
  onError,
  onClose,
}: DeleteEmployeeProps) => {
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleDeleteEmployee = () => {
    deleteUser(selectedEmployee.id.toString(), {
      onSuccess: () => {
        console.log('Delete employee success');
        onSuccess();
      },
      onError: (error: ErrorResponse) => {
        console.error('Delete employee error', error);
        onError(error);
      },
    });
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-notoLoopThaiRegular">
        คุณต้องการลบข้อมูลพนักงาน "{selectedEmployee.firstname}{' '}
        {selectedEmployee.lastname}" ใช่หรือไม่?
      </p>
      <p className="mb-4 text-red-500 font-notoExtraBold">
        คำเตือน: การลบข้อมูลพนักงานจะไม่สามารถกู้คืนได้!
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-notoLoopThaiRegular"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDeleteEmployee}
          disabled={isDeletingUser}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300 font-notoLoopThaiRegular"
        >
          {isDeletingUser ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
  );
};

export default DeleteEmployeeForm;
