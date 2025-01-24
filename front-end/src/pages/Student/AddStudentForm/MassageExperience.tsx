import React, { useState, useEffect } from 'react';
import CheckboxFour from '../../../components/Checkboxes/CheckboxFour';
import { useFormContext } from 'react-hook-form';
import TextArea from '../../../components/Forms/TextArea';

const MassageExperience = () => {
  useEffect(() => {
    document.getElementById('scroll-target')?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([
    'ไม่เคยนวด/เรียน',
  ]);

  useEffect(() => {
    const [learnDetail, workDetail] = watch([
      'learn_massage_description',
      'work_massage_description',
    ]);

    const experiences: string[] = [];

    if (learnDetail) {
      experiences.push('เคยนวด/เรียน');
      setValue('learn_massage', 'เคยนวด/เรียน');
    } else {
      setValue('learn_massage', 'ไม่เคยนวด/เรียน');
      setValue('learn_massage_description', null);
    }

    if (workDetail) {
      experiences.push('เคยทำงานเกี่ยวข้องกับการนวดไทย');
      setValue('work_massage', 'เคยทำงานเกี่ยวข้องกับการนวดไทย');
    } else {
      setValue('work_massage', 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย');
      setValue('work_massage_description', null);
    }

    if (experiences.length > 0) {
      setSelectedExperiences(experiences);
    }
  }, []);

  const handleExperienceChange = (value: string) => {
    let newExperiences: string[];

    if (value === 'ไม่เคยนวด/เรียน') {
      // ถ้าเลือก "ไม่เคยนวด" ให้ยกเลิกตัวเลือกอื่นๆ
      newExperiences = ['ไม่เคยนวด/เรียน'];
      setValue('learn_massage', 'ไม่เคยนวด/เรียน');
      setValue('work_massage', 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย');
      setValue('learn_massage_description', null);
      setValue('work_massage_description', null);
      console.log('ถ้าเลือก "ไม่เคยนวด" ให้ยกเลิกตัวเลือกอื่นๆ');
    } else if (selectedExperiences.includes(value)) {
      // ถ้าเคยเลือกไว้แล้ว ให้ลบออก
      newExperiences = selectedExperiences.filter((exp) => exp !== value);
      if (value === 'เคยนวด/เรียน') {
        setValue('learn_massage', 'ไม่เคยนวด/เรียน');
        setValue('learn_massage_description', null);
      }
      if (value === 'เคยทำงานเกี่ยวข้องกับการนวดไทย') {
        setValue('work_massage', 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย');
        setValue('work_massage_description', null);
      }
    } else {
      // เพิ่มตัวเลือกใหม่
      newExperiences = selectedExperiences.includes('ไม่เคยนวด/เรียน')
        ? [value]
        : [...selectedExperiences, value];

      if (value === 'เคยนวด/เรียน') {
        setValue('learn_massage', 'เคยนวด/เรียน');
      }
      if (value === 'เคยทำงานเกี่ยวข้องกับการนวดไทย') {
        setValue('work_massage', 'เคยทำงานเกี่ยวข้องกับการนวดไทย');
      }
      console.log('// เพิ่มตัวเลือกใหม่', newExperiences);
    }

    // ถ้าไม่มีตัวเลือกใดๆ ให้กลับไปเลือก "ไม่เคยนวด"
    if (newExperiences.length === 0) {
      newExperiences = ['ไม่เคยนวด/เรียน'];
      setValue('learn_massage', 'ไม่เคยนวด/เรียน');
      setValue('work_massage', 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย');
    }
    setSelectedExperiences(newExperiences);
  };

  return (
    <>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-gray-700 dark:text-white font-notoExtraBold">
          ประสบการณ์ในการนวด
        </h1>
        <div className="mt-4">
          <CheckboxFour
            label="ไม่เคยนวด/เรียน"
            name="no_experience"
            isChecked={selectedExperiences.includes('ไม่เคยนวด/เรียน')}
            onChange={() => handleExperienceChange('ไม่เคยนวด/เรียน')}
          />
          <CheckboxFour
            label="เคยนวด/เรียน"
            name="has_learn_experience"
            isChecked={selectedExperiences.includes('เคยนวด/เรียน')}
            onChange={() => handleExperienceChange('เคยนวด/เรียน')}
          />
          <TextArea
            name="learn_massage_description"
            label="ระบุประสบการณ์ในการนวด"
            placeholder="ระบุประสบการณ์ในการนวด"
            className="ml-9 mt-4"
            maxLength={70}
            required={true}
            isDisabled={!selectedExperiences.includes('เคยนวด/เรียน')}
            error={errors.learn_massage_description?.message as string}
            includeRegister={register}
          />
        </div>
        <div className="mt-4">
          <CheckboxFour
            label="เคยทำงานเกี่ยวข้องกับการนวดไทย"
            name="has_work_experience"
            isChecked={selectedExperiences.includes(
              'เคยทำงานเกี่ยวข้องกับการนวดไทย',
            )}
            onChange={() =>
              handleExperienceChange('เคยทำงานเกี่ยวข้องกับการนวดไทย')
            }
          />
          <TextArea
            name="work_massage_description"
            label="ระบุประสบการณ์ในการนวด"
            placeholder="ระบุประสบการณ์ในการนวด"
            className="ml-9 mt-4"
            maxLength={70}
            required={true}
            isDisabled={
              !selectedExperiences.includes('เคยทำงานเกี่ยวข้องกับการนวดไทย')
            }
            error={errors.work_massage_description?.message as string}
            includeRegister={register}
          />
        </div>
      </div>
    </>
  );
};

export default MassageExperience;
