import React, { useEffect, useState } from 'react';
import TextField from '../../../components/Forms/TextField';
import DropdownSearchWithController from '../../../components/Forms/DropdownSearchWithController';
import DatePickerWithController from '../../../components/Forms/DatePicker/DatePickerWithController';
import { useFormContext } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';

import {
  fetchMaritalStatuses,
  fetchProvinces,
  fetchPrefixNames,
  fetchStudentById,
} from '../../../services/api';
import IconArrowLeft from '../../../common/ArrowLeft';
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

interface SelectOption {
  value: number;
  label: string;
}

type MaritalStatus = SelectOption;
type Province = SelectOption;
type PrefixName = SelectOption;

interface ProvinceResponse {
  status: string;
  message: string;
  data: {
    id: number;
    code: number;
    name_in_thai: string;
    name_in_english: string;
  }[];
}

interface PersonalInformationProps {
  isEditMode?: boolean;
  studentId?: string;
  studentData?: any;
  stepNames: string[];
  handleSkip: (step: number) => void;
}

const PersonalInformation = ({
  isEditMode = false,
  stepNames,
  handleSkip,
}: PersonalInformationProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const navigate = useNavigate();
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [prefixNames, setPrefixNames] = useState<PrefixName[]>([]);

  useEffect(() => {
    const fetchMaritals = async () => {
      const response: AxiosResponse<{ id: number; marital_name: string }[]> =
        await fetchMaritalStatuses();
      const formattedStatuses = response.data.map((status) => ({
        value: status.id,
        label: status.marital_name,
      }));
      setMaritalStatuses(formattedStatuses);
    };

    const fetchProvinceList = async () => {
      const response: AxiosResponse<ProvinceResponse> = await fetchProvinces();
      const formattedProvinces = response.data.data.map((province) => ({
        value: province.id,
        label: province.name_in_thai,
      }));
      setProvinces(formattedProvinces);
    };

    const fetchPrefixList = async () => {
      const response: AxiosResponse<
        {
          id: number;
          prename_tha: string;
          prename_eng: string;
          prename_short_tha?: string;
          prename_short_eng?: string;
        }[]
      > = await fetchPrefixNames(isEditMode);
      const formattedPrefixNames = response.data.map((prefixName) => ({
        value: prefixName.id,
        label: prefixName.prename_tha,
      }));
      setPrefixNames(formattedPrefixNames);
    };
    fetchMaritals();
    fetchProvinceList();
    fetchPrefixList();
  }, []);

  return (
    <>
      <div className="mt-8 mb-8">
        {isEditMode && (
          <div className="border-b-4 border-gray-300 pb-4">
            <Button
              variant="text"
              type="button"
              className="underline px-0 py-0 flex items-center gap-2"
              onClick={() => {
                navigate(-1);
              }}
            >
              <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />{' '}
              <span className="text-black dark:text-white">ย้อนกลับ</span>
            </Button>
            <h1 className="mt-[1rem] mb-6 text-5xl font-bold text-gray-700 dark:text-white font-notoExtraBold">
              หน้าแก้ไขข้อมูลนักเรียน
            </h1>
            <span className="text-xl text-slate-500 font-notoRegular dark:text-white">
              ข้ามไปหน้าที่
            </span>
            {stepNames.map((step, index) => (
              <button
                type="button"
                key={index}
                className="flex items-center gap-2 text-slate-500 hover:underline dark:text-white font-notoLoopThaiRegular"
                onClick={() => handleSkip(index)}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>
        )}
        <h1 className="mt-[2rem] mb-6 text-4xl font-bold text-gray-700 dark:text-white font-notoExtraBold">
          วันที่สมัครจากใบสมัครนักเรียน
        </h1>
        <DatePickerWithController
          label="วันที่สมัครจากใบสมัครนักเรียน"
          name="date_register_from_form"
          placeholder="วัน/เดือน/ปี"
          required={true}
          control={control}
          error={
            typeof errors.date_register_from_form?.message === 'string'
              ? errors.date_register_from_form.message
              : ''
          }
        />
      </div>

      <h1 className="mt-[1.5rem] mb-6 text-4xl font-bold text-gray-700 dark:text-white font-notoExtraBold">
        ประวัติส่วนตัว
      </h1>
      <div className="mt-4 md:grid grid-cols-2 gap-4">
        <DropdownSearchWithController<SelectOption['value']>
          // className="col-span-2 lg:w-[49.3%]"
          label="คำนำหน้า"
          name="prename_tha"
          placeholder="คำนำหน้า"
          required={true}
          options={prefixNames}
          control={control}
          error={
            typeof errors.prename_tha?.message === 'string'
              ? errors.prename_tha.message
              : ''
          }
        />
        <DropdownSearchWithController
          label="เพศ"
          name="gender"
          placeholder="เพศ"
          required={true}
          options={[
            { value: 1, label: 'ชาย' },
            { value: 2, label: 'หญิง' },
          ]}
          control={control}
          error={
            typeof errors.gender?.message === 'string'
              ? errors.gender.message
              : ''
          }
        />
        <TextField
          label="ชื่อนักเรียน - ภาษาไทย"
          name="firstname_tha"
          includeRegister={register}
          placeholder="ชื่อนักเรียน"
          required={true}
          error={
            typeof errors.firstname_tha?.message === 'string'
              ? errors.firstname_tha.message
              : ''
          }
        />
        <TextField
          label="นามสกุลนักเรียน - ภาษาไทย"
          name="lastname_tha"
          includeRegister={register}
          placeholder="นามสกุลนักเรียน"
          required={true}
          error={
            typeof errors.lastname_tha?.message === 'string'
              ? errors.lastname_tha.message
              : ''
          }
        />
        <TextField
          label="ชื่อนักเรียน - ภาษาอังกฤษ"
          name="firstname_eng"
          includeRegister={register}
          placeholder="ชื่อนักเรียน"
          required={true}
          error={
            typeof errors.firstname_eng?.message === 'string'
              ? errors.firstname_eng.message
              : ''
          }
        />
        <TextField
          label="นามสกุลนักเรียน - ภาษาอังกฤษ"
          name="lastname_eng"
          includeRegister={register}
          placeholder="นามสกุลนักเรียน"
          required={true}
          error={
            typeof errors.lastname_eng?.message === 'string'
              ? errors.lastname_eng.message
              : ''
          }
        />
        <TextField
          label="เลขประจำตัวประชาชน"
          name="citizenid_card"
          includeRegister={register}
          placeholder="เลขประจำตัวประชาชน"
          required={true}
          error={
            typeof errors.citizenid_card?.message === 'string'
              ? errors.citizenid_card.message
              : ''
          }
        />
        <DatePickerWithController
          label="วัน/เดือน/ปี เกิด"
          name="birthdate"
          placeholder="วันเกิด"
          required={true}
          control={control}
          error={
            typeof errors.birthdate?.message === 'string'
              ? errors.birthdate.message
              : ''
          }
        />
        <DropdownSearchWithController<SelectOption['value']>
          label="สถานภาพปัจจุบัน"
          name="marital_status"
          options={maritalStatuses}
          control={control}
          required={true}
          placeholder="โปรดเลือกสถานภาพปัจจุบัน"
          error={
            typeof errors.marital_status?.message === 'string'
              ? errors.marital_status.message
              : ''
          }
        />
        <DropdownSearchWithController<SelectOption['value']>
          label="สถานที่เกิด"
          name="birth_province"
          placeholder="สถานที่เกิด"
          options={provinces}
          control={control}
          required={true}
          error={
            typeof errors.birth_province?.message === 'string'
              ? errors.birth_province.message
              : ''
          }
        />
      </div>
    </>
  );
};

export default PersonalInformation;
