import React, { useState } from 'react';
import CheckboxFour from '../Checkboxes/CheckboxFour';

const MassageExperience = ({
  formProps: {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  },
}) => {
  const [massageExperienceCheckBox, setMassageExperienceCheckBox] =
    useState<string>('ไม่เคย');
  return (
    <>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black">
          ประสบการณ์ในการนวด
        </h1>
        <CheckboxFour
          label="ไม่เคยนวด/เรียน"
          name="has_massage_experience_learn"
          isChecked={massageExperienceCheckBox === 'ไม่เคย'}
          onChange={() => {
            setMassageExperienceCheckBox('ไม่เคย');
            setValue('has_massage_experience_learn', 'ไม่เคย');
            setValue('massage_experience_learn_detail', null);
          }}
        />
        <CheckboxFour
          label="เคยนวด/เรียน"
          name="has_massage_experience_learn"
          isChecked={massageExperienceCheckBox === 'เคย'}
          onChange={() => {
            setMassageExperienceCheckBox('เคย');
            setValue('has_massage_experience_learn', 'เคย');
            setValue('massage_experience_learn_detail', null);
          }}
        />
      </div>
    </>
  );
};

export default MassageExperience;
