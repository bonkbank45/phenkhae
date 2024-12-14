import React, { useEffect, useState } from 'react';
import TextField from '../Forms/TextField';
import DatePickerOne from '../Forms/DatePicker/DatePickerOne';
import SelectGroupTwo from '../Forms/SelectGroup/SelectGroupTwo';
import DropdownSearchWithController from '../Forms/DropdownSearchWithController';
import { UseFormReturn, useFormContext } from 'react-hook-form';

import { AxiosResponse } from 'axios';

import {
  fetchMaritalStatuses,
  fetchProvinces,
  fetchPrefixNames,
} from '../../services/api';

interface PersonalInformationProps {
  formProps: UseFormReturn<{
    prename_tha: number;
    firstname_tha: string;
    lastname_tha: string;
    firstname_eng: string;
    lastname_eng: string;
    citizenid_card: string;
    birthdate: string;
    marital_status: number;
    birth_province: number;
  }>;
}

interface MaritalStatus {
  id: number;
  name: string;
}

interface Province {
  value: number;
  label: string;
}

interface PrefixName {
  value: number;
  label: string;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [prefixNames, setPrefixNames] = useState<PrefixName[]>([]);

  useEffect(() => {
    const fetchMaritals = async () => {
      const response: AxiosResponse<{ id: number; marital_name: string }[]> =
        await fetchMaritalStatuses();
      const formattedStatuses = response.data.map((status) => ({
        id: status.id,
        name: status.marital_name,
      }));
      setMaritalStatuses(formattedStatuses);
    };

    const fetchProvinceList = async () => {
      const response: AxiosResponse<
        {
          id: number;
          code: number;
          name_in_thai: string;
          name_in_english: string;
        }[]
      > = await fetchProvinces();
      const formattedProvinces = response.data.map((province) => ({
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
      > = await fetchPrefixNames();
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
      <h1 className="mt-6 mb-6 text-4xl font-bold text-black">
        ประวัติส่วนตัว
      </h1>
      <div className="mt-4 md:grid grid-cols-2 gap-4">
        <DropdownSearchWithController
          className="col-span-2 lg:w-[49.3%]"
          label="คำนำหน้า"
          name="prename_tha"
          placeholder="คำนำหน้า"
          options={prefixNames}
          control={control}
          error={
            typeof errors.prename_tha?.message === 'string'
              ? errors.prename_tha.message
              : ''
          }
        />
        <TextField
          label="ชื่อนักเรียน - ภาษาไทย"
          name="firstname_tha"
          includeRegister={register}
          placeholder="ชื่อนักเรียน"
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
          error={
            typeof errors.citizenid_card?.message === 'string'
              ? errors.citizenid_card.message
              : ''
          }
        />
        <DatePickerOne
          label="วัน/เดือน/ปี เกิด"
          name="birthdate"
          includeRegister={register}
          placeholder="วันเกิด"
          error={
            typeof errors.birthdate?.message === 'string'
              ? errors.birthdate.message
              : ''
          }
        />
        <SelectGroupTwo
          label="สถานภาพปัจจุบัน"
          name="marital_status"
          includeRegister={register}
          options={maritalStatuses}
          placeholder="โปรดเลือกสถานภาพปัจจุบัน"
          error={
            typeof errors.marital_status?.message === 'string'
              ? errors.marital_status.message
              : ''
          }
        />
        <DropdownSearchWithController
          label="สถานที่เกิด"
          name="birth_province"
          placeholder="สถานที่เกิด"
          options={provinces}
          control={control}
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
