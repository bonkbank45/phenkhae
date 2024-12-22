import React, { useState, useEffect } from 'react';
import CheckboxFour from '../Checkboxes/CheckboxFour';
import { useFormContext } from 'react-hook-form';
import TextArea from '../Forms/TextArea';

const MassageExperience = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [massageExperienceCheckBox, setMassageExperienceCheckBox] =
    useState<string>('ไม่เคยนวด/เรียน');

  useEffect(() => {
    setValue('has_massage_experience_learn', 'ไม่เคยนวด/เรียน');
    setValue(
      'has_massage_experience_work',
      'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย',
    );
    setValue('massage_experience_learn_detail', null);
    setValue('massage_experience_work_detail', null);
  }, []);

  return (
    <>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
          ประสบการณ์ในการนวด
        </h1>
        <div className="mt-4">
          <CheckboxFour
            label="ไม่เคยนวด/เรียน"
            name="has_massage_experience_learn"
            isChecked={massageExperienceCheckBox === 'ไม่เคยนวด/เรียน'}
            onChange={() => {
              setMassageExperienceCheckBox('ไม่เคยนวด/เรียน');
              setValue('has_massage_experience_learn', 'ไม่เคยนวด/เรียน');
              setValue(
                'has_massage_experience_work',
                'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย',
              );
              setValue('massage_experience_learn_detail', null);
              setValue('massage_experience_work_detail', null);
            }}
          />
          <CheckboxFour
            label="เคยนวด/เรียน"
            name="has_massage_experience_learn"
            isChecked={massageExperienceCheckBox === 'เคยนวด/เรียน'}
            onChange={() => {
              setMassageExperienceCheckBox('เคยนวด/เรียน');
              setValue('has_massage_experience_learn', 'เคยนวด/เรียน');
              setValue(
                'has_massage_experience_work',
                'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย',
              );
              setValue('massage_experience_work_detail', null);
            }}
          />
          <TextArea
            name="massage_experience_learn_detail"
            label="ระบุประสบการณ์ในการนวด"
            placeholder="ระบุประสบการณ์ในการนวด"
            className="ml-9 mt-4"
            isDisabled={
              massageExperienceCheckBox === 'ไม่เคยนวด/เรียน' ||
              massageExperienceCheckBox === 'เคยทำงานเกี่ยวข้องกับการนวดไทย'
            }
            error={errors.massage_experience_learn_detail?.message as string}
            includeRegister={register}
          />
        </div>
        <div className="mt-4">
          <CheckboxFour
            label="เคยทำงานเกี่ยวข้องกับการนวดไทย"
            name="has_massage_experience_work"
            isChecked={
              massageExperienceCheckBox === 'เคยทำงานเกี่ยวข้องกับการนวดไทย'
            }
            onChange={() => {
              setMassageExperienceCheckBox('เคยทำงานเกี่ยวข้องกับการนวดไทย');
              setValue(
                'has_massage_experience_work',
                'เคยทำงานเกี่ยวข้องกับการนวดไทย',
              );
              setValue('has_massage_experience_learn', 'ไม่เคยนวด/เรียน');
              setValue('massage_experience_learn_detail', null);
            }}
          />
          <TextArea
            name="massage_experience_work_detail"
            label="ระบุประสบการณ์ในการนวด"
            placeholder="ระบุประสบการณ์ในการนวด"
            className="ml-9 mt-4"
            isDisabled={
              massageExperienceCheckBox === 'ไม่เคยนวด/เรียน' ||
              massageExperienceCheckBox === 'เคยนวด/เรียน'
            }
            error={errors.massage_experience_work_detail?.message as string}
            includeRegister={register}
          />
        </div>
      </div>
    </>
  );
};

export default MassageExperience;
