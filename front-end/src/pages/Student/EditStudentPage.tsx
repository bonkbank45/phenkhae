import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import StepperForm from '../../components/StepperForm';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import {
  useAddStudentData,
  useEditStudentData,
  AddStudentData,
} from '../../hooks/api/useStudentData';

import { personalInformationSchema } from '../../schema/addStudent/personalInformationSchema';
import { additionalPersonalInformationSchema } from '../../schema/addStudent/additionalPersonalInformationSchema';
import { currentAddressSchema } from '../../schema/addStudent/currentAddressSchema';
import { massageExperienceSchema } from '../../schema/addStudent/massageExperienceSchema';
import { uploadImageSchema } from '../../schema/addStudent/uploadImageSchema';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';
import EditStudentForm from './EditStudentForm';
import { fetchStudentById } from '../../services/api';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Spinner from '../../common/Spinner';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types/student';
import { AxiosResponse } from 'axios';

interface StudentFormValues {
  date_register_from_form: string;
  prename_tha: number;
  firstname_tha: string;
  lastname_tha: string;
  firstname_eng: string;
  lastname_eng: string;
  citizenid_card: string;
  birthdate: string;
  marital_status: number;
  birth_province: number;
  has_medical_condition: 'มี' | 'ไม่มี';
  medical_condition: number | null;
  has_surgery_history: 'เคยผ่าตัด' | 'ไม่เคยผ่าตัด';
  surgery_history: string | null;
  email: string;
  phone_number: string;
  occupation_student: string;
  father_fname: string;
  father_lname: string;
  mother_fname: string;
  mother_lname: string;
  address_num: string;
  address_moo: string;
  address_soi: string;
  address_road: string;
  address_province: number;
  address_district: number;
  address_sub_district: number;
  address_zip_code: string;
  edu_qual: string;
  edu_ins: string;
  learn_massage: 'เคยนวด/เรียน' | 'ไม่เคยนวด/เรียน';
  learn_massage_description: string;
  work_massage:
    | 'เคยทำงานเกี่ยวข้องกับการนวดไทย'
    | 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย';
  work_massage_description: string;
}

const EditStudentPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const { mutate: editStudentData, isPending: isEditStudentDataPending } =
    useEditStudentData(Number(id));
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<{ data: Student }> =
          await fetchStudentById(id);
        setStudentData(response.data.data);
        resetFormWithStudentData(response.data.data);
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
        editStudentData(formData as AddStudentData, {
          onSuccess: async () => {
            toast.success('แก้ไขข้อมูลนักเรียนสำเร็จ');
            try {
              const response: AxiosResponse<{ data: Student }> =
                await fetchStudentById(id);
              setStudentData(response.data.data);
              resetFormWithStudentData(response.data.data);
            } catch (error) {
              console.error('Error fetching updated student data:', error);
            }
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
              methods.setError(key as keyof StudentFormValues, {
                type: 'manual',
                message: value[0],
              }),
            );
            toast.error(`แก้ไขข้อมูลนักเรียนไม่สำเร็จ: ${errorMessages}`);
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

  const methods = useForm<StudentFormValues>({
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
    resolver: yupResolver(schemas[activeStep]),
  });

  const resetFormWithStudentData = (data: any) => {
    methods.reset({
      date_register_from_form:
        format(data?.date_register_from_form, 'dd/MM/yyyy') || '',
      prename_tha: data?.prename.id || '',
      firstname_tha: data?.firstname_tha || '',
      lastname_tha: data?.lastname_tha || '',
      firstname_eng: data?.firstname_eng || '',
      lastname_eng: data?.lastname_eng || '',
      citizenid_card: data?.citizenid_card || '',
      birthdate: format(data?.birthdate, 'dd/MM/yyyy') || '',
      marital_status: data?.marital_id || '',
      birth_province: data?.birth_province_id || '',
      has_medical_condition: data?.medical_condition_id ? 'มี' : 'ไม่มี',
      medical_condition: data?.medical_condition_id || null,
      has_surgery_history: data?.surgery_history_id
        ? 'เคยผ่าตัด'
        : 'ไม่เคยผ่าตัด',
      surgery_history: data?.surgery_history_id || null,
      email: data?.email || '',
      phone_number: data?.phonenumber || '',
      occupation_student: data?.occupation.id || '',
      father_fname: data?.father_fname || '',
      father_lname: data?.father_lname || '',
      mother_fname: data?.mother_fname || '',
      mother_lname: data?.mother_lname || '',
      address_num: data?.address_num || '',
      address_moo: data?.address_moo || '',
      address_soi: data?.address_soi || '',
      address_road: data?.address_road || '',
      address_province: data?.subdistrict.districts.provinces.id || '',
      address_district: data?.subdistrict.districts.id || '',
      address_sub_district: data?.address_subdistrict_id || '',
      address_zip_code: data?.address_zip_code || '',
      edu_qual: data?.edu_qual.id || '',
      edu_ins: data?.edu_ins || '',
      learn_massage: data?.learn_massage ? 'เคยนวด/เรียน' : 'ไม่เคยนวด/เรียน',
      learn_massage_description: data?.learn_massage_description || '',
      work_massage: data?.work_massage
        ? 'เคยทำงานเกี่ยวข้องกับการนวดไทย'
        : 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย',
      work_massage_description: data?.work_massage_description || '',
    });
  };

  const handleSkip = (step: number) => {
    setActiveStep(step);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <StepperForm
        Form={
          <EditStudentForm
            activeStep={activeStep}
            studentData={studentData}
            stepNames={steps}
            handleSkip={handleSkip}
          />
        }
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
