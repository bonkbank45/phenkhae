import React from 'react';
import { useFormContext } from 'react-hook-form';
import DatePickerWithController from '../../../components/Forms/DatePicker/DatePickerWithController';
const AdditionalInformation = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <div className="h-[50vh]">
        <h1 className="mt-[1.5rem] mb-6 text-4xl font-bold text-gray-700 dark:text-white font-notoExtraBold">
          ข้อมูลเพิ่มเติม
        </h1>
        <div className="flex h-full justify-start items-center">
          <DatePickerWithController
            label="วันที่สมัครจากใบสมัครนักเรียน"
            name="application_date"
            placeholder="วัน/เดือน/ปี"
            control={control}
          />
        </div>
      </div>
    </>
  );
};

export default AdditionalInformation;
