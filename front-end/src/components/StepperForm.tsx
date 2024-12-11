import { useState } from 'react';

import { Stepper, Step, Button } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';

import PersonalInformation from './AddStudentForm/PersonalInformation';
import AdditionalPersonalInformation from './AddStudentForm/AdditionalPersonalInformation';
import CurrentAddress from './AddStudentForm/CurrentAddress';
import MassageExperience from './AddStudentForm/MassageExperience';
import CourseTraining from './AddStudentForm/CourseTraining';
import UploadImage from './AddStudentForm/UploadImage';

import { personalInformationSchema } from '../schema/personalInformationSchema';
import { yupResolver } from '@hookform/resolvers/yup';

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

export function DefaultStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const informationForm = useForm<PersonalInformationFormSchema>({
    resolver: yupResolver(personalInformationSchema),
  });

  const additionalInformationForm = useForm<PersonalInformationFormSchema>({
    resolver: yupResolver(personalInformationSchema),
  });

  const { trigger } = informationForm;

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const steps = getSteps();

  // const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && !isLastStep) {
      setActiveStep((cur) => cur + 1);
    }
  };
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <PersonalInformation
            header={getSteps()[step]}
            formProps={informationForm}
          />
        );
      case 1:
        return (
          <AdditionalPersonalInformation
            header={getSteps()[step]}
            formProps={informationForm}
          />
        );
      case 2:
        return <CurrentAddress />;
      case 3:
        return <MassageExperience />;
      case 4:
        return <CourseTraining />;
      case 5:
        return <UploadImage />;
      default:
        return (
          <PersonalInformation
            header={getSteps()[step]}
            formProps={informationForm}
          />
        );
    }
  }

  return (
    <div className="w-full py-4 px-8">
      <form onSubmit={informationForm.handleSubmit(handleSubmit)}>
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
