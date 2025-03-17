import * as yup from 'yup';

export const additionalPersonalInformationSchema = yup.object().shape({
  email: yup.string().nullable().email('รูปแบบอีเมล์ไม่ถูกต้อง'),
  phone_number: yup
    .string()
    .required('กรุณากรอกเบอร์โทรศัพท์')
    .matches(/^[0-9]+$/, 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'),
  occupation_student: yup
    .number()
    .required('กรุณาเลือกอาชีพปัจจุบันของนักเรียน'),
  father_fname: yup.string().required('กรุณากรอกชื่อบิดา'),
  father_lname: yup.string().required('กรุณากรอกนามสกุลบิดา'),
  mother_fname: yup.string().required('กรุณากรอกชื่อมารดา'),
  mother_lname: yup.string().required('กรุณากรอกนามสกุลมารดา'),
  medical_condition: yup.string().when('has_medical_condition', {
    is: 'มี',
    then: (schema) => schema.required('กรุณากรอกโรคประจำตัว'),
    otherwise: (schema) => schema.nullable(),
  }),
  surgery_history: yup.string().when('has_surgery_history', {
    is: 'เคยผ่าตัด',
    then: (schema) => schema.required('กรุณากรอกประวัติการผ่าตัด'),
    otherwise: (schema) => schema.nullable(),
  }),
});
