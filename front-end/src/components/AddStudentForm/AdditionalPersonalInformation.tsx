import React, { useState, useEffect } from 'react';
import { UseFormReturn, Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { AxiosResponse } from 'axios';
import { fetchMedicalConditions } from '../../services/api';
import CheckboxFour from '../Checkboxes/CheckboxFour';
import TextField from '../Forms/TextField';
import TextArea from '../Forms/TextArea';

interface MedicalCondition {
  value: number;
  label: string;
}

const AdditionalPersonalInformation: React.FC = ({}) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [medicalConditionCheckBox, setMedicalConditionCheckBox] =
    useState<string>('ไม่มี');
  const [surgeryHistoryCheckBox, setSurgeryHistoryCheckBox] =
    useState<string>('ไม่เคยผ่าตัด');
  const [medicalConditionList, setMedicalConditionList] = useState<
    MedicalCondition[]
  >([]);

  useEffect(() => {
    const fetchMedicalConditionList = async () => {
      const response: AxiosResponse<{
        status: string;
        message: string;
        data: { id: number; name: string }[];
      }> = await fetchMedicalConditions();
      console.log(response.data);
      const formattedConditions = response.data.data.map((condition) => ({
        value: condition.id,
        label: condition.name,
      }));
      setMedicalConditionList(formattedConditions);
    };
    fetchMedicalConditionList();
  }, []);

  useEffect(() => {
    setMedicalConditionCheckBox('ไม่มี');
    setSurgeryHistoryCheckBox('ไม่เคยผ่าตัด');
    setValue('has_medical_condition', 'ไม่มี');
    setValue('has_surgery_history', 'ไม่เคยผ่าตัด');
    setValue('medical_condition', null);
    setValue('surgery_history', null);
  }, []);

  return (
    <>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black">
          ประวัติส่วนตัวเพิ่มเติม
        </h1>
        <div className="mt-4 md:grid grid-cols-2 gap-4">
          <TextField
            label="ชื่อบิดา"
            name="father_fname"
            placeholder="ชื่อบิดา"
            includeRegister={register}
            error={errors.father_fname?.message as string}
          />
          <TextField
            label="นามสกุลบิดา"
            name="father_lname"
            placeholder="นามสกุลบิดา"
            includeRegister={register}
            error={errors.father_lname?.message as string}
          />
          <TextField
            label="ชื่อมารดา"
            name="mother_fname"
            placeholder="ชื่อมารดา"
            includeRegister={register}
            error={errors.mother_fname?.message as string}
          />
          <TextField
            label="นามสกุลมารดา"
            name="mother_lname"
            placeholder="นามสกุลมารดา"
            includeRegister={register}
            error={errors.mother_lname?.message as string}
          />
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black">โรคประจำตัว</h1>
        <CheckboxFour
          label="ไม่มี"
          name="has_medical_condition"
          isChecked={medicalConditionCheckBox === 'ไม่มี'}
          onChange={() => {
            setMedicalConditionCheckBox('ไม่มี');
            setValue('has_medical_condition', 'ไม่มี');
            setValue('medical_condition', null);
          }}
        />
        <div className="flex flex-row gap-4 items-center">
          <CheckboxFour
            label="มี"
            name="has_medical_condition"
            isChecked={medicalConditionCheckBox === 'มี'}
            onChange={() => {
              setMedicalConditionCheckBox('มี');
              setValue('has_medical_condition', 'มี');
            }}
          />
          <Controller
            control={control}
            name="medical_condition"
            render={({ field }) => (
              <Select
                onChange={(e) => {
                  field.onChange(e?.value);
                }}
                options={medicalConditionList}
                isDisabled={medicalConditionCheckBox === 'ไม่มี'}
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: errors.medical_condition
                      ? 'red'
                      : base.borderColor,
                  }),
                }}
              />
            )}
          />
          <p className="text-red-500">
            {errors.medical_condition?.message as string}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black">การผ่าตัด</h1>
        <CheckboxFour
          name="has_surgery_history"
          label="ไม่เคยผ่าตัด"
          isChecked={surgeryHistoryCheckBox === 'ไม่เคยผ่าตัด'}
          onChange={() => {
            setSurgeryHistoryCheckBox('ไม่เคยผ่าตัด');
            setValue('has_surgery_history', 'ไม่เคยผ่าตัด');
            setValue('surgery_history', null);
          }}
        />
        <CheckboxFour
          name="has_surgery_history"
          label="เคยผ่าตัด"
          isChecked={surgeryHistoryCheckBox === 'เคยผ่าตัด'}
          onChange={() => {
            setSurgeryHistoryCheckBox('เคยผ่าตัด');
            setValue('has_surgery_history', 'เคยผ่าตัด');
          }}
        />
        <TextArea
          name="surgery_history"
          label="ระบุประวัติการผ่าตัด"
          isDisabled={surgeryHistoryCheckBox === 'ไม่เคยผ่าตัด'}
          placeholder="ระบุประวัติการผ่าตัด (ถ้ามี)"
          className="ml-8 mt-4"
          includeRegister={register}
          error={errors.surgery_history?.message as string}
        />
      </div>
    </>
  );
};

export default AdditionalPersonalInformation;
