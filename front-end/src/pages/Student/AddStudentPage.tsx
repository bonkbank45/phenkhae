import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import StepperForm from '../../components/StepperForm';
import AddStudentForm from './AddStudentForm/AddStudentForm';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import {
  useAddStudentData,
  AddStudentData,
} from '../../hooks/api/useStudentData';

import { personalInformationSchema } from '../../schema/addStudent/personalInformationSchema';
import { additionalPersonalInformationSchema } from '../../schema/addStudent/additionalPersonalInformationSchema';
import { currentAddressSchema } from '../../schema/addStudent/currentAddressSchema';
import { massageExperienceSchema } from '../../schema/addStudent/massageExperienceSchema';
import { trainingCourseSchema } from '../../schema/addStudent/trainingCourseSchema';
import { uploadImageSchema } from '../../schema/addStudent/uploadImageSchema';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';

const AddStudent = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    'ข้อมูลส่วนตัว',
    'ข้อมูลส่วนตัวเพิ่มเติม',
    'ที่อยู่ปัจจุบัน',
    'ประสบการณ์การนวด',
    'การอบรมหลักสูตร',
    'อัปโหลดรูปภาพ',
  ];

  const schemas = [
    personalInformationSchema,
    additionalPersonalInformationSchema,
    currentAddressSchema,
    massageExperienceSchema,
    trainingCourseSchema,
    uploadImageSchema,
  ];

  const methods = useForm({
    resolver: yupResolver(schemas[activeStep]),
  });

  const {
    mutate: addStudentData,
    isPending: isAddStudentDataPending,
    isError: isAddStudentDataError,
    error: addStudentDataError,
  } = useAddStudentData();

  const handleNext = async () => {
    const isValid = await methods.trigger();
    console.log(methods.getValues());
    if (isValid) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else if (activeStep === steps.length - 1) {
        const formData = methods.getValues();
        console.log('Form Data:', formData);
        addStudentData(formData as AddStudentData, {
          onSuccess: () => {
            toast.success('เพิ่มข้อมูลนักเรียนสำเร็จ');
            methods.reset();
            setActiveStep(0);
          },
          onError: (error: ErrorResponse) => {
            let errorMessages = '';
            if (error.response.data.errors) {
              console.error(error);
              errorMessages = Object.entries(error.response.data.errors)
                .map(([_, value]) => value[0])
                .join(', ');
            } else {
              console.error(error);
              errorMessages = error.response.data.message;
            }
            Object.entries(error.response.data.errors).forEach(([key, value]) =>
              methods.setError(key, {
                type: 'manual',
                message: value[0],
              }),
            );
            toast.error(`เพิ่มข้อมูลนักเรียนไม่สำเร็จ: ${errorMessages}`);
          },
        });
      }
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async (data: any) => {
    console.log('Form Data:', data);
  };

  return (
    <FormProvider {...methods}>
      <StepperForm
        Form={<AddStudentForm activeStep={activeStep} />}
        steps={steps}
        isLastStep={activeStep === steps.length - 1}
        isFirstStep={activeStep === 0}
        isLoading={isAddStudentDataPending}
        activeStep={activeStep}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </FormProvider>
  );
};

export default AddStudent;
