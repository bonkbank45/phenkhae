import * as yup from 'yup';

export const additionalPersonalInformationSchema = yup.object().shape({
  email: yup
    .string()
    .nullable()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'รูปแบบอีเมล์ไม่ถูกต้อง',
    ),
  phone_number: yup
    .string()
    .required('กรุณากรอกเบอร์โทรศัพท์')
    .matches(/^[0-9]+$/, 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'),
  occupation_student: yup
    .number()
    .required('กรุณาเลือกอาชีพปัจจุบันของนักเรียน'),
  father_fname: yup.string().nullable(),
  father_lname: yup.string().nullable(),
  mother_fname: yup.string().nullable(),
  mother_lname: yup.string().nullable(),
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
