import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Spinner } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import IconArrowLeft from '../../common/ArrowLeft';
import TextField from '../../components/Forms/TextField';
import CheckboxOne from '../../components/Checkboxes/CheckboxOne';
import { yupResolver } from '@hookform/resolvers/yup';
import { addPrenameSchema } from '../../schema/addPrename/addPrename';
interface PrenameFormData {
  id: number;
  prename_tha: string;
  prename_eng: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
  show_status: number;
}

interface PrenameFormProps {
  initialData?: PrenameFormData;
  onSubmit: (data: PrenameFormData) => void;
  isLoading?: boolean;
  formOptions?: any;
}

const PrenameForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  formOptions,
}: PrenameFormProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PrenameFormData>({
    defaultValues: {
      ...initialData,
      show_status: initialData?.show_status || 0,
    },
    resolver: formOptions?.resolver || yupResolver(addPrenameSchema),
  });

  const [showStatus, setShowStatus] = useState(initialData?.show_status || 0);

  const handleCheckboxChange = (id: string) => {
    setShowStatus(showStatus === 1 ? 0 : 1);
    setValue('show_status', showStatus === 1 ? 0 : 1);
  };

  const handleSubmitForm = (data: PrenameFormData) => {
    onSubmit({
      ...data,
      show_status: showStatus,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button
        variant="text"
        type="button"
        className="underline px-0 flex items-center gap-2"
        onClick={() => {
          navigate(-1);
        }}
      >
        <IconArrowLeft className="w-4 h-4" /> ย้อนกลับ
      </Button>
      <h1 className="text-2xl text-black dark:text-white font-bold mb-4 font-notoLoopThaiRegular">
        {initialData ? 'แก้ไขคำนำหน้าชื่อ' : 'เพิ่มคำนำหน้าชื่อ'}
      </h1>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
        {initialData ? null : (
          <TextField
            name="id"
            label="ไอดี"
            type="number"
            placeholder="ไอดี"
            includeRegister={() =>
              register('id', {
                valueAsNumber: true,
              })
            }
            error={errors.id?.message}
          />
        )}
        <TextField
          name="prename_tha"
          label="คำนำหน้าชื่อภาษาไทย"
          placeholder="นาย"
          includeRegister={register}
          error={errors.prename_tha?.message}
        />
        <TextField
          name="prename_eng"
          label="คำนำหน้าชื่อภาษาอังกฤษ"
          placeholder="Mr."
          includeRegister={register}
          error={errors.prename_eng?.message}
        />
        <TextField
          name="prename_short_tha"
          label="คำนำหน้าชื่อย่อภาษาไทย"
          placeholder="น."
          includeRegister={register}
          error={errors.prename_short_tha?.message}
        />
        <TextField
          name="prename_short_eng"
          label="คำนำหน้าชื่อย่อภาษาอังกฤษ"
          placeholder="Mr."
          includeRegister={register}
          error={errors.prename_short_eng?.message}
        />
        <CheckboxOne
          name="show_status"
          label="แสดงผล"
          id="show_status"
          className="font-notoLoopThaiRegular"
          checked={showStatus === 1}
          onChange={() => {
            handleCheckboxChange('show_status');
          }}
        />

        <Button
          type="submit"
          className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          <div className="flex items-center gap-2">
            {isLoading && <Spinner className="w-4 h-4" color="blue" />}
            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
          </div>
        </Button>
      </form>
    </div>
  );
};

export default PrenameForm;
