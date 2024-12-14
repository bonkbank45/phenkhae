import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import StepperForm from '../components/StepperForm';
import AddStudentForm from '../components/AddStudentForm/AddStudentForm';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';

import { personalInformationSchema } from '../schema/personalInformationSchema';
import { additionalPersonalInformationSchema } from '../schema/additionalPersonalInformationSchema';
import { currentAddressSchema } from '../schema/currentAddressSchema';
import { massageExperienceSchema } from '../schema/massageExperienceSchema';
import { trainingCourseSchema } from '../schema/trainingCourseSchema';

const AddStudent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    'ข้อมูลส่วนตัว',
    'ข้อมูลส่วนตัวเพิ่มเติม',
    'ที่อยู่ปัจจุบัน',
    'ประสบการณ์การนวด',
    'การอบรมหลักสูตร',
  ];

  const schemas = [
    personalInformationSchema,
    additionalPersonalInformationSchema,
    currentAddressSchema,
    massageExperienceSchema,
    trainingCourseSchema,
  ];

  const methods = useForm({
    resolver: yupResolver(schemas[activeStep]),
  });

  const handleNext = async () => {
    console.log('Active Step:', activeStep);
    console.log('Current Schema:', schemas[activeStep]);
    console.log('Form Data:', methods.getValues());
    const isValid = await methods.trigger();
    if (isValid) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <StepperForm
        Form={<AddStudentForm activeStep={activeStep} />}
        steps={steps}
        isLastStep={activeStep === steps.length - 1}
        isFirstStep={activeStep === 0}
        activeStep={activeStep}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </FormProvider>
  );
};

export default AddStudent;
