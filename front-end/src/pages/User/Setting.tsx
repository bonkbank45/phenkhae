import TextField from '../../components/Forms/TextField';
import { useForm } from 'react-hook-form';
import { Button } from '@material-tailwind/react';
import { useAuth } from '../../context/AuthContext';
import { useEditUser } from '../../hooks/api/useUserData';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

const schema = yup.object().shape({
  firstname: yup.string().required('กรุณากรอกชื่อ'),
  lastname: yup.string().required('กรุณากรอกนามสกุล'),
  email: yup
    .string()
    .email('กรุณากรอกอีเมล์ที่ถูกต้อง')
    .required('กรุณากรอกอีเมล์'),
});

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  profile_image: string | null;
  is_remove_image: boolean;
}

export default function Setting() {
  const { user, fetchCurrentUser } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      profile_image: user?.profile_img,
      is_remove_image: false,
    },
    resolver: yupResolver(schema),
  });
  const { mutate: editUser, isPending: isEditUserPending } = useEditUser();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isDefaultImage, setIsDefaultImage] = useState(false);

  const imageUrl =
    isDefaultImage || !user?.profile_img
      ? `${
          import.meta.env.VITE_API_URL
        }/storage/profiles/users/default-profile.png`
      : `${import.meta.env.VITE_API_URL}/storage/profiles/users/${
          user.profile_img
        }.jpg?t=${new Date().getTime()}`;

  const role = (userRole: string) => {
    if (userRole === 'admin') {
      return 'ผู้ดูแลระบบ';
    } else {
      return 'พนักงาน';
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsDefaultImage(false);
      setValue('is_remove_image', false);
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setIsDefaultImage(true);
    setValue('profile_image', null);
    setValue('is_remove_image', true);
  };

  const handleEditUser = async (data: FormData) => {
    const formData = new FormData();
    formData.append('firstname', data.firstname);
    formData.append('lastname', data.lastname);
    formData.append('email', data.email);
    formData.append('id', user?.id || '');
    formData.append('is_remove_image', data.is_remove_image ? 'true' : 'false');
    if (selectedImage) {
      formData.append('profile_image', selectedImage);
    }

    editUser(formData, {
      onSuccess: () => {
        toast.success('แก้ไขข้อมูลสำเร็จ');
        fetchCurrentUser();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-white dark:bg-slate-800 rounded-lg text-[#c9d1d9] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-slate-500 dark:text-white font-notoExtraBold">
          ตั้งค่าบัญชีผู้ใช้งาน
          <div className="flex gap-4">
            <span className="text-sm text-slate-500 dark:text-white font-notoLoopThaiRegular">
              สถานะผู้ใช้งาน: {role(user?.role)}
            </span>
          </div>
        </h1>

        <div className="border-t border-slate-200 my-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Name Section */}
            <TextField
              label="อีเมล"
              name="email"
              placeholder="example@gmail.com"
              includeRegister={register}
              error={errors.email?.message as string}
            />
            <TextField
              label="ชื่อ"
              name="firstname"
              placeholder="ชื่อผู้ใช้งาน"
              includeRegister={register}
              error={errors.firstname?.message as string}
            />
            <TextField
              label="นามสกุล"
              name="lastname"
              placeholder="นามสกุลผู้ใช้งาน"
              includeRegister={register}
              error={errors.lastname?.message as string}
            />
            <Button
              color="blue"
              className="font-notoLoopThaiRegular"
              onClick={handleSubmit(handleEditUser)}
              disabled={isEditUserPending}
              loading={isEditUserPending}
            >
              บันทึก
            </Button>
          </div>

          {/* Profile Picture Section */}
          <div className="space-y-2">
            <label className="block font-medium text-slate-500 dark:text-white">
              รูปภาพโปรไฟล์
            </label>
            <div className="relative">
              <div
                className="w-full aspect-square max-w-[260px] rounded-full overflow-hidden bg-[#161b22] relative group cursor-pointer"
                onClick={() => setShowOptions(true)}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile picture"
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
                  />
                ) : (
                  <>
                    <img
                      src={imageUrl}
                      alt="Profile picture"
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
                    />
                  </>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white">คลิกเพื่อจัดการรูปภาพ</span>
                </div>
              </div>

              {/* Image Options Modal */}
              {showOptions && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg z-50 w-[260px]">
                  <div className="space-y-2">
                    <label className="block w-full">
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-notoLoopThaiRegular"
                        onClick={() =>
                          document.getElementById('fileInput')?.click()
                        }
                      >
                        อัพโหลดรูปภาพ
                      </Button>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageUpload(e);
                          setShowOptions(false);
                        }}
                      />
                    </label>
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-notoLoopThaiRegular"
                      onClick={() => {
                        handleImageDelete();
                        setShowOptions(false);
                      }}
                    >
                      ลบรูปภาพ
                    </Button>
                    <Button
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-notoLoopThaiRegular"
                      onClick={() => setShowOptions(false)}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
