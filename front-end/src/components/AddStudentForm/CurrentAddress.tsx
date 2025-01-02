import React, { useEffect } from 'react';
import TextField from '../Forms/TextField';
import DropdownSearchWithController from '../Forms/DropdownSearchWithController';
import { useEducationQual } from '../../hooks/api/useEducationQual';
import { useAddressData } from '../../hooks/api/useAddressData';
import { useFormContext } from 'react-hook-form';

type provinceValue = number;
type districtValue = number;
type subDistrictValue = number;
type educationQualValue = string;

const CurrentAddress = () => {
  const {
    watch,
    setValue,
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const provinceId = watch('address_province');
  const districtId = watch('address_district');
  const { provinces, districts, subDistricts } = useAddressData(
    provinceId,
    districtId,
  );

  const { data: educationQualData, isLoading: isLoadingEducationQual } =
    useEducationQual();

  const formattedEducationQual =
    educationQualData?.data?.map((educationQual) => ({
      value: educationQual.id,
      label: educationQual.edu_qual_name,
    })) || [];

  console.log({
    provinces,
    isArray: Array.isArray(provinces),
    length: provinces?.length,
  });

  useEffect(() => {
    if (provinceId) {
      setValue('address_district', null);
      setValue('address_sub_district', null);
    }
  }, [provinceId, setValue]);

  useEffect(() => {
    if (districtId) {
      setValue('address_sub_district', null);
    }
  }, [districtId, setValue]);

  return (
    <>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
          ที่อยู่ปัจจุบัน
        </h1>
        <div className="mt-4 md:grid grid-cols-2 gap-4">
          <TextField
            label="เลขที่"
            name="address_num"
            placeholder="เลขที่"
            required={true}
            includeRegister={register}
            error={errors.address_num?.message as string}
          />
          <TextField
            label="หมู่ที่"
            name="address_moo"
            placeholder="หมู่ที่"
            includeRegister={register}
            error={errors.address_moo?.message as string}
          />
          <TextField
            label="ตรอก/ซอย"
            name="address_soi"
            placeholder="ตรอก/ซอย"
            includeRegister={register}
            error={errors.address_soi?.message as string}
          />
          <TextField
            label="ถนน"
            name="address_road"
            placeholder="ถนน"
            includeRegister={register}
            error={errors.address_road?.message as string}
          />
          <DropdownSearchWithController<provinceValue>
            label="จังหวัด"
            name="address_province"
            placeholder="จังหวัด"
            required={true}
            options={provinces || []}
            control={control}
            error={errors.address_province?.message as string}
          />
          <DropdownSearchWithController<districtValue>
            label="เขต/อำเภอ"
            name="address_district"
            placeholder="เขต/อำเภอ"
            required={true}
            options={districts || []}
            control={control}
            error={errors.address_district?.message as string}
            disabled={!provinceId}
          />
          <DropdownSearchWithController<subDistrictValue>
            label="แขวง/ตำบล"
            name="address_sub_district"
            placeholder="ตำบล"
            required={true}
            options={subDistricts || []}
            control={control}
            error={errors.address_sub_district?.message as string}
            disabled={!districtId}
          />
          <TextField
            label="รหัสไปรษณีย์"
            name="address_zip_code"
            placeholder="รหัสไปรษณีย์"
            required={true}
            includeRegister={register}
            error={errors.address_zip_code?.message as string}
          />
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
          วุฒิการศึกษา
        </h1>
        <div className="mt-4 md:grid grid-cols-2 gap-4">
          <DropdownSearchWithController<educationQualValue>
            label="วุฒิการศึกษาสูงสุด"
            name="edu_qual"
            placeholder="วุฒิการศึกษาสูงสุด"
            options={formattedEducationQual || []}
            control={control}
            error={errors.edu_qual?.message as string}
          />
          <TextField
            label="จากสถานศึกษา"
            name="edu_ins"
            placeholder="สถานศึกษา"
            includeRegister={register}
            error={errors.edu_ins?.message as string}
          />
          {/* <DropdownSearchWithController
            label="จากสถานศึกษา"
            name="edu_inses"
            placeholder="สถานศึกษา"
            options={[]}
            control={control}
            error={errors.edu_ins_id?.message as string}
          /> */}
        </div>
      </div>
    </>
  );
};

export default CurrentAddress;
