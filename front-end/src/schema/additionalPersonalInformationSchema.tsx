import * as yup from 'yup';

export const additionalPersonalInformationSchema = yup.object().shape({
  father_fname: yup.string().required('กรุณากรอกชื่อบิดา'),
  father_lname: yup.string().required('กรุณากรอกนามสกุลบิดา'),
  mother_fname: yup.string().required('กรุณากรอกชื่อมารดา'),
  mother_lname: yup.string().required('กรุณากรอกนามสกุลมารดา'),
  medical_condition: yup.number().when('has_medical_condition', {
    is: 'มี',
    then: (schema) => schema.required('กรุณาเลือกโรคประจำตัว'),
    otherwise: (schema) => schema.nullable(),
  }),
  surgery_history: yup.string().when('has_surgery_history', {
    is: 'เคยผ่าตัด',
    then: (schema) => schema.required('กรุณากรอกประวัติการผ่าตัด'),
    otherwise: (schema) => schema.nullable(),
  }),
});
