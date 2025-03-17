import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditUser } from '../../../hooks/api/admin/useUserData';
import { ErrorResponse } from '../../../types/error_response';
import { useResetPassword } from '../../../hooks/api/useUserData';
import { toast } from 'react-toastify';
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

const EditEmployeeForm = ({
  initialData,
  onSuccess,
  onError,
}: {
  initialData: User;
  onSuccess: () => void;
  onError: (error: ErrorResponse) => void;
}) => {
  const [defaultImage, setDefaultImage] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: initialData.firstname,
      lastname: initialData.lastname,
    },
    resolver: yupResolver(
      yup.object().shape({
        firstname: yup.string().required('กรุณากรอกชื่อ'),
        lastname: yup.string().required('กรุณากรอกนามสกุล'),
      }),
    ),
  });

  const { mutate: editUser, isPending: isEditUserPending } = useEditUser();

  const { mutate: resetPassword, isPending: isResetPasswordPending } =
    useResetPassword();

  const handleDeleteImage = () => {
    setDefaultImage(true);
    setValue('is_remove_image', true);
  };

  const onSubmit = (data: Pick<User, 'firstname' | 'lastname'>) => {
    editUser(
      {
        ...data,
        id: initialData.id.toString(),
        is_remove_image: defaultImage,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: ErrorResponse) => {
          if (error.response.data.errors.firstname) {
            setError('firstname', {
              message: error.response.data.errors.firstname[0],
            });
          }
          if (error.response.data.errors.lastname) {
            setError('lastname', {
              message: error.response.data.errors.lastname[0],
            });
          }
          onError(error);
        },
      },
    );
  };

  const handleResetPassword = () => {
    resetPassword(
      { email: initialData.email },
      {
        onSuccess: () => {
          toast.success('ส่งอีเมล์ตั้งค่ารหัสผ่านใหม่เรียบร้อย');
        },
        onError: (error: ErrorResponse) => {
          toast.error(
            'เกิดข้อผิดพลาดในการส่งอีเมล์: ' + error.response.data.message,
          );
        },
      },
    );
  };

  const imageUrl =
    defaultImage || !initialData.profile_img
      ? `${
          import.meta.env.VITE_API_URL
        }/storage/profiles/users/default-profile.png`
      : `${import.meta.env.VITE_API_URL}/storage/profiles/users/${
          initialData.profile_img
        }.jpg?t=${new Date().getTime()}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="flex justify-center items-center">
        <img src={imageUrl} alt="profile" className="w-24 h-24 rounded-full" />
      </div>
      <TextField
        label="ชื่อ"
        includeRegister={register}
        name="firstname"
        placeholder="สมชาย"
        required={true}
        error={errors.firstname?.message}
      />
      <TextField
        label="นามสกุล"
        includeRegister={register}
        name="lastname"
        placeholder="ใจดี"
        required={true}
        error={errors.lastname?.message}
      />
      <div className="flex justify-start items-center gap-4">
        <Button
          color="blue"
          className="px-4 py-3 mt-4 font-notoLoopThaiRegular"
          onClick={handleResetPassword}
          disabled={isResetPasswordPending}
          loading={isResetPasswordPending}
        >
          ส่งอีเมล์ตั้งค่ารหัสผ่านใหม่
        </Button>
        <Button onClick={handleDeleteImage} color="red" className="mt-4">
          ลบรูปภาพ
        </Button>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          color="blue"
          className="px-4 py-3 font-notoLoopThaiRegular"
          type="submit"
          disabled={isEditUserPending}
          loading={isEditUserPending}
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default EditEmployeeForm;
