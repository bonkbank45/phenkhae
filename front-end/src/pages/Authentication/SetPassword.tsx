import { useSearchParams } from 'react-router-dom';
import { useSetPassword } from '../../hooks/api/useUserData';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { mutate: setPassword, isPending } = useSetPassword();

  // เพิ่มการตรวจสอบ token
  if (!token) {
    return (
      <div className="min-h-screen w-full overflow-hidden rounded-sm bg-gradient-to-r from-teal-400 to-yellow-200">
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md bg-opacity-75">
          <div className="text-red-500 text-center font-notoLoopThaiRegular">
            ไม่พบ Token สำหรับตั้งรหัสผ่าน กรุณาตรวจสอบลิงก์อีกครั้ง
          </div>
        </div>
      </div>
    );
  }

  // สร้าง form ด้วย react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // ฟังก์ชันสำหรับส่งข้อมูล
  const onSubmit = (data: { password: string; confirmPassword: string }) => {
    if (token) {
      setPassword(
        {
          token,
          password: data.password,
          password_confirmation: data.confirmPassword,
        },
        {
          onSuccess: () => {
            toast.success('ตั้งรหัสผ่านเรียบร้อย');
            navigate('/auth/signin');
          },
          onError: (error: ErrorResponse) => {
            toast.error(
              'เกิดข้อผิดพลาดในการตั้งรหัสผ่าน: ' + error.response.data.message,
            );
          },
        },
      );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden rounded-sm bg-gradient-to-r from-teal-400 to-yellow-200">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md bg-opacity-75">
        <h2 className="text-2xl font-notoExtraBold mb-6">ตั้งรหัสผ่านใหม่</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2 font-notoLoopThaiRegular">
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              {...register('password', {
                required: 'กรุณากรอกรหัสผ่าน',
                minLength: {
                  value: 8,
                  message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <span className="text-red-500 text-sm font-notoLoopThaiRegular">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-notoLoopThaiRegular">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'กรุณายืนยันรหัสผ่าน',
                validate: (value) =>
                  value === watch('password') || 'รหัสผ่านไม่ตรงกัน',
              })}
              className="w-full p-2 border rounded"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm font-notoLoopThaiRegular">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-notoLoopThaiRegular"
          >
            {isPending ? 'กำลังตั้งรหัสผ่าน...' : 'ตั้งรหัสผ่าน'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
