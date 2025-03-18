import React from 'react';
import { useAddEmployeeData } from '../../hooks/api/useUserData';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';

// สร้าง interface สำหรับข้อมูลพนักงาน
interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
}

// validation schema
const schema = yup.object({
  firstName: yup.string().required('กรุณากรอกชื่อ'),
  lastName: yup.string().required('กรุณากรอกนามสกุล'),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'รูปแบบอีเมล์ไม่ถูกต้อง',
    )
    .required('กรุณากรอกอีเมล์'),
});

export const CreateAccount = () => {
  const { mutate: addEmployeeData, isPending } = useAddEmployeeData();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: EmployeeFormData) => {
    addEmployeeData(
      {
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName,
      },
      {
        onSuccess: () => {
          toast.success('ส่งอีเมลเพื่อตั้งรหัสผ่านเรียบร้อย');
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  };

  return (
    <div className="max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-500 font-notoExtraBold dark:text-white">
        เพิ่มบัญชีพนักงาน
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div>
            <TextField
              name="firstName"
              label="ชื่อ"
              type="text"
              includeRegister={register}
              error={errors.firstName?.message}
              placeholder="กรอกชื่อ"
              required={true}
            />
          </div>

          <div>
            <TextField
              name="lastName"
              label="นามสกุล"
              type="text"
              includeRegister={register}
              error={errors.lastName?.message}
              placeholder="กรอกนามสกุล"
              required={true}
            />
          </div>

          <div>
            <TextField
              name="email"
              label="อีเมล"
              type="email"
              includeRegister={register}
              error={errors.email?.message}
              placeholder="example@email.com"
              required={true}
            />
          </div>
        </div>

        <div className="flex justify-start mt-6">
          <Button
            type="submit"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition-colors duration-200 font-notoLoopThaiRegular"
            disabled={isPending}
            loading={isPending}
          >
            บันทึก
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
