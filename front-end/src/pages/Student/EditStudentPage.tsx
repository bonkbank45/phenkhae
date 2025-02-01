import { useEffect, useState } from 'react';
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
import EditStudentForm from './EditStudentForm';
import { fetchStudentById } from '../../services/api';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const EditStudentPage = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const [studentData, setStudentData] = useState<any>(null);
  const steps = [
    'ข้อมูลส่วนตัว',
    'ข้อมูลส่วนตัวเพิ่มเติม',
    'ที่อยู่ปัจจุบัน',
    'ประสบการณ์การนวด',
    'อัปโหลดรูปภาพ',
  ];

  const schemas = [
    personalInformationSchema,
    additionalPersonalInformationSchema,
    currentAddressSchema,
    massageExperienceSchema,
    uploadImageSchema,
  ];

  const [isLoading, setIsLoading] = useState(true);

  console.log('studentData', studentData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStudentById(id);
        setStudentData(response.data.data);

        const studentData = response.data.data;

        methods.reset({
          date_register_from_form:
            format(studentData?.date_register_from_form, 'dd-MM-yyyy') || '',
          prename_tha: studentData?.prename.id || '',
          firstname_tha: studentData?.firstname_tha || '',
          lastname_tha: studentData?.lastname_tha || '',
          firstname_eng: studentData?.firstname_eng || '',
          lastname_eng: studentData?.lastname_eng || '',
          citizenid_card: studentData?.citizenid_card || '',
          birthdate: format(studentData?.birthdate, 'dd-MM-yyyy') || '',
          marital_status: studentData?.marital_id || '',
          birth_province: studentData?.birth_province_id || '',
          has_medical_condition: studentData?.medical_condition_id
            ? 'มี'
            : 'ไม่มี',
          medical_condition: studentData?.medical_condition_id || null,
          has_surgery_history: studentData?.surgery_history_id
            ? 'เคยผ่าตัด'
            : 'ไม่เคยผ่าตัด',
          surgery_history: studentData?.surgery_history_id || null,
          email: studentData?.email || '',
          phone_number: studentData?.phonenumber || '',
          occupation_student: studentData?.occupation.id || '',
          father_fname: studentData?.father_fname || '',
          father_lname: studentData?.father_lname || '',
          mother_fname: studentData?.mother_fname || '',
          mother_lname: studentData?.mother_lname || '',
          address_num: studentData?.address_num || '',
          address_moo: studentData?.address_moo || '',
          address_soi: studentData?.address_soi || '',
          address_road: studentData?.address_road || '',
          address_province:
            studentData?.subdistrict.districts.provinces.id || '',
          address_district: studentData?.subdistrict.districts.id || '',
          address_sub_district: studentData?.address_subdistrict_id || '',
          address_zip_code: studentData?.address_zip_code || '',
          edu_qual: studentData?.edu_qual.id || '',
          edu_ins: studentData?.edu_ins || '',
          learn_massage: studentData?.learn_massage
            ? 'เคยนวด/เรียน'
            : 'ไม่เคยนวด/เรียน',
          learn_massage_description:
            studentData?.learn_massage_description || '',
          work_massage: studentData?.work_massage
            ? 'เคยทำงานเกี่ยวข้องกับการนวดไทย'
            : 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย',
          work_massage_description: studentData?.work_massage_description || '',
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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

  const methods = useForm({
    defaultValues: {
      email: '',
      phone_number: '',
      father_fname: '',
      father_lname: '',
      mother_fname: '',
      mother_lname: '',
      occupation_student: '',
      has_medical_condition: 'ไม่มี',
      medical_condition: null,
      has_surgery_history: 'ไม่เคยผ่าตัด',
      surgery_history: null,
    },
  });

  if (isLoading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <FormProvider {...methods}>
      <StepperForm
        Form={<EditStudentForm activeStep={activeStep} />}
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

export default EditStudentPage;
