import React from 'react';
import TextField from '../Forms/TextField';
import DropdownSearchWithController from '../Forms/DropdownSearchWithController';

const CurrentAddress = ({
  formProps: {
    register,
    control,
    setValue,
    formState: { errors },
  },
}) => {
  return (
    <>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black">
          ที่อยู่ปัจจุบัน
        </h1>
        <div className="mt-4 md:grid grid-cols-2 gap-4">
          <TextField
            label="เลขที่"
            name="address_num"
            placeholder="เลขที่"
            includeRegister={register}
            error={errors.address_num?.message}
          />
          <TextField
            label="หมู่ที่"
            name="address_moo"
            placeholder="หมู่ที่"
            includeRegister={register}
            error={errors.address_moo?.message}
          />
          <TextField
            label="ตรอก/ซอย"
            name="address_soi"
            placeholder="ตรอก/ซอย"
            includeRegister={register}
            error={errors.address_soi?.message}
          />
          <TextField
            label="ถนน"
            name="address_road"
            placeholder="ถนน"
            includeRegister={register}
            error={errors.address_road?.message}
          />
          <DropdownSearchWithController
            label="แขวง/ตำบล"
            name="address_sub_district"
            placeholder="ตำบล"
            options={[]}
            control={control}
            error={errors.address_sub_district?.message}
          />
          <DropdownSearchWithController
            label="เขต/อำเภอ"
            name="address_district"
            placeholder="เขต/อำเภอ"
            options={[]}
            control={control}
            error={errors.address_district?.message}
          />
          <DropdownSearchWithController
            label="จังหวัด"
            name="address_province"
            placeholder="จังหวัด"
            options={[]}
            control={control}
            error={errors.address_province?.message}
          />
          <TextField
            label="รหัสไปรษณีย์"
            name="address_zip_code"
            placeholder="รหัสไปรษณีย์"
            includeRegister={register}
            error={errors.address_zip_code?.message}
          />
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black">
          วุฒิการศึกษา
        </h1>
        <div className="mt-4 md:grid grid-cols-2 gap-4">
          <DropdownSearchWithController
            label="วุฒิการศึกษาสูงสุด"
            name="edu_qual"
            placeholder="วุฒิการศึกษาสูงสุด"
            options={[]}
            control={control}
            error={errors.edu_qual_id?.message}
          />
          <DropdownSearchWithController
            label="จากสถานศึกษา"
            name="edu_inses"
            placeholder="สถานศึกษา"
            options={[]}
            control={control}
            error={errors.edu_ins_id?.message}
          />
        </div>
      </div>
    </>
  );
};

export default CurrentAddress;
