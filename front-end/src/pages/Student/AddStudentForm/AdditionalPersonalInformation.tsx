import { useState, useEffect } from 'react';
import DropdownSearchWithController from '../../../components/Forms/DropdownSearchWithController';
import CheckboxFour from '../../../components/Checkboxes/CheckboxFour';
import TextField from '../../../components/Forms/TextField';
import TextArea from '../../../components/Forms/TextArea';
import { useOccupationData } from '../../../hooks/api/useOccupationData';
import { useFormContext } from 'react-hook-form';
import { useMedicalConditionData } from '../../../hooks/api/useMedicalConditionData';
import { useEducationQual } from '../../../hooks/api/useEducationQual';

interface SelectOptionMedicalCondition {
  value: number;
  label: string;
}
interface SelectOptionOccupation {
  value: string;
  label: string;
}

const AdditionalPersonalInformation = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const {
    data: occupationData,
    isLoading: isLoadingOccupation,
    error: errorOccupation,
  } = useOccupationData();

  const {
    data: medicalConditionData,
    isLoading: isLoadingMedicalCondition,
    error: errorMedicalCondition,
  } = useMedicalConditionData();

  const { data: educationQualData, isLoading: isLoadingEducationQual } =
    useEducationQual();

  const formattedEducationQual =
    educationQualData?.data?.map((educationQual) => ({
      value: educationQual.id,
      label: educationQual.edu_qual_name,
    })) || [];

  const formattedOccupations =
    occupationData?.data?.map((occupation) => ({
      value: occupation.id,
      label: occupation.occupation_name,
    })) || [];

  const formattedMedicalConditions =
    medicalConditionData?.data?.map((medicalCondition) => ({
      value: medicalCondition.id,
      label: medicalCondition.name,
    })) || [];

  const [medicalConditionCheckBox, setMedicalConditionCheckBox] =
    useState<string>('ไม่มี');
  const [surgeryHistoryCheckBox, setSurgeryHistoryCheckBox] =
    useState<string>('ไม่เคยผ่าตัด');
  const [medicalConditionList, setMedicalConditionList] = useState<
    SelectOptionMedicalCondition[]
  >([]);

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
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
          ประวัติส่วนตัวเพิ่มเติม
        </h1>
        <div className="mt-4 md:grid grid-cols-2 gap-4">
          <TextField
            label="อีเมล์นักเรียน"
            name="email"
            placeholder="อีเมล์นักเรียน"
            required={true}
            includeRegister={register}
            error={errors.email?.message as string}
          />
          <TextField
            label="เบอร์โทรศัพท์นักเรียน"
            name="phone_number"
            placeholder="เบอร์โทรศัพท์นักเรียน"
            required={true}
            includeRegister={register}
            error={errors.phone_number?.message as string}
          />
          <DropdownSearchWithController<SelectOptionOccupation['value']>
            label="อาชีพปัจจุบันของนักเรียน"
            name="occupation_student"
            className="col-span-2"
            options={formattedOccupations}
            control={control}
            required={true}
            isLoading={isLoadingOccupation}
            placeholder="โปรดเลือกอาชีพปัจจุบันของนักเรียน"
            error={
              typeof errors.occupation_student?.message === 'string'
                ? errors.occupation_student.message
                : ''
            }
          />
          <TextField
            label="ชื่อบิดา"
            name="father_fname"
            placeholder="ชื่อบิดา"
            required={true}
            includeRegister={register}
            error={errors.father_fname?.message as string}
          />
          <TextField
            label="นามสกุลบิดา"
            name="father_lname"
            placeholder="นามสกุลบิดา"
            includeRegister={register}
            required={true}
            error={errors.father_lname?.message as string}
          />
          <TextField
            label="ชื่อมารดา"
            name="mother_fname"
            placeholder="ชื่อมารดา"
            includeRegister={register}
            required={true}
            error={errors.mother_fname?.message as string}
          />
          <TextField
            label="นามสกุลมารดา"
            name="mother_lname"
            placeholder="นามสกุลมารดา"
            includeRegister={register}
            required={true}
            error={errors.mother_lname?.message as string}
          />
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
          โรคประจำตัว
        </h1>
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
        <div className="flex flex-row gap-4 items-end">
          <CheckboxFour
            label="มี"
            name="has_medical_condition"
            isChecked={medicalConditionCheckBox === 'มี'}
            onChange={() => {
              setMedicalConditionCheckBox('มี');
              setValue('has_medical_condition', 'มี');
            }}
          />
          <DropdownSearchWithController<SelectOptionMedicalCondition['value']>
            label="โรคประจำตัว"
            name="medical_condition"
            className={medicalConditionCheckBox === 'ไม่มี' ? 'hidden' : 'mt-4'}
            options={formattedMedicalConditions}
            control={control}
            disabled={medicalConditionCheckBox === 'ไม่มี'}
            required={true}
            isLoading={isLoadingMedicalCondition}
            placeholder="โปรดเลือกโรคประจำตัว"
            error={errors.medical_condition?.message as string}
          />
        </div>
      </div>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
          การผ่าตัด
        </h1>
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
          required={true}
          includeRegister={register}
          error={errors.surgery_history?.message as string}
        />
      </div>
    </>
  );
};

export default AdditionalPersonalInformation;
