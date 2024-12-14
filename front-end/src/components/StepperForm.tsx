import { useState } from 'react';

import { Stepper, Step, Button } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';

import PersonalInformation from './AddStudentForm/PersonalInformation';
import AdditionalPersonalInformation from './AddStudentForm/AdditionalPersonalInformation';
import CurrentAddress from './AddStudentForm/CurrentAddress';
import MassageExperience from './AddStudentForm/MassageExperience';
import CourseTraining from './AddStudentForm/CourseTraining';
import UploadImage from './AddStudentForm/UploadImage';

import { yupResolver } from '@hookform/resolvers/yup';
import { personalInformationSchema } from '../schema/personalInformationSchema';
import { additionalPersonalInformationSchema } from '../schema/additionalPersonalInformationSchema';
import { currentAddressSchema } from '../schema/currentAddressSchema';
import { massageExperienceSchema } from '../schema/massageExperienceSchema';

function getSteps() {
  return [
    'ประวัติส่วนตัว',
    'ประวัติส่วนตัวเพิ่มเติม',
    'ที่อยู่ปัจจุบัน',
    'ประสบการณ์ในการนวด',
    'การอบรมหลักสูตร',
    'อัปโหลดรูปภาพ',
  ];
}

type PersonalInformationFormSchema = {
  prename_tha: number;
  firstname_tha: string;
  lastname_tha: string;
  firstname_eng: string;
  lastname_eng: string;
  citizenid_card: string;
  birthdate: string;
  marital_status: number;
  birth_province: number;
};

type AdditionalPersonalInformationFormSchema = {
  father_fname: string;
  father_lname: string;
  mother_fname: string;
  mother_lname: string;
  medical_condition?: number;
  surgery_history?: string;
  has_medical_condition: string;
  has_surgery_history: string;
};

type CurrentAddressFormSchema = {
  address: string;
  sub_district: string;
  district: string;
  province: string;
};

type MassageExperienceFormSchema = {
  has_massage_experience_learn: string;
  has_massage_experience_work: string;
  massage_experience_learn_detail: string;
  massage_experience_work_detail: string;
};

export function DefaultStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const informationForm = useForm<PersonalInformationFormSchema>({
    resolver: yupResolver(personalInformationSchema),
  });

  const additionalInformationForm =
    useForm<AdditionalPersonalInformationFormSchema>({
      resolver: yupResolver(additionalPersonalInformationSchema),
    });

  const currentAddressForm = useForm<CurrentAddressFormSchema>({
    resolver: yupResolver(currentAddressSchema),
  });

  const massageExperienceForm = useForm<MassageExperienceFormSchema>({
    resolver: yupResolver(massageExperienceSchema),
  });

  const { trigger: triggerInformationForm } = informationForm;
  const { trigger: triggerAdditionalInformationForm } =
    additionalInformationForm;
  const { trigger: triggerCurrentAddressForm } = currentAddressForm;
  const { trigger: triggerMassageExperienceForm } = massageExperienceForm;

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const steps = getSteps();

  const handleNext = async () => {
    switch (activeStep) {
      case 0:
        const isValid0 = await triggerInformationForm();
        if (isValid0 && !isLastStep) {
          setActiveStep((cur) => cur + 1);
        }
        break;
      case 1:
        const isValid1 = await triggerAdditionalInformationForm();
        if (isValid1 && !isLastStep) {
          setActiveStep((cur) => cur + 1);
        }
        break;
      case 2:
        const isValid2 = await triggerCurrentAddressForm();
        if (isValid2 && !isLastStep) {
          setActiveStep((cur) => cur + 1);
        }
        break;
      case 3:
        const isValid3 = await triggerMassageExperienceForm();
        if (isValid3 && !isLastStep) {
          setActiveStep((cur) => cur + 1);
        }
        break;
    }
  };
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <PersonalInformation formProps={informationForm} />;
      case 1:
        return (
          <AdditionalPersonalInformation
            formProps={additionalInformationForm}
          />
        );
      case 2:
        return <CurrentAddress formProps={currentAddressForm} />;
      case 3:
        return <MassageExperience formProps={massageExperienceForm} />;
      case 4:
        return <CourseTraining />;
      case 5:
        return <UploadImage />;
      default:
        return <PersonalInformation formProps={informationForm} />;
    }
  }

  return (
    <div className="w-full py-4 px-8">
      <form
        onSubmit={
          activeStep === 1
            ? informationForm.handleSubmit(handleSubmit)
            : activeStep === 2
            ? additionalInformationForm.handleSubmit(handleSubmit)
            : currentAddressForm.handleSubmit(handleSubmit)
        }
      >
        <Stepper
          lineClassName="bg-zinc-300"
          activeLineClassName="bg-black"
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
        >
          {steps.map((label, index) => (
            <Step
              key={index}
              className="h-7 w-7 pt-0.5 bg-zinc-300 cursor-pointer text-center"
              activeClassName="!bg-black text-white"
              completedClassName="bg-black text-white"
              onClick={() => setActiveStep(index)}
            >
              {index + 1}
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <div className="mt-7 flex justify-between">
          <Button
            className={`${isFirstStep ? 'bg-gray-500' : 'bg-black'}`}
            onClick={handlePrev}
            disabled={isFirstStep}
          >
            ย้อนกลับ
          </Button>
          <Button
            type="submit"
            className={`${isLastStep ? 'bg-gray-500' : 'bg-black'}`}
            onClick={handleNext}
            disabled={isLastStep}
          >
            ถัดไป
          </Button>
        </div>
      </form>
    </div>
  );
}
