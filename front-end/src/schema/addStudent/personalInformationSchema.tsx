import * as yup from 'yup';

// Regular expression to match Thai characters
const thaiCharacterPattern = /^[ก-๙\s]+$/;

// Regular expression to match English characters
const englishCharacterPattern = /^[A-Za-z\s]+$/;

// Regular expression to match numeric characters
const numericPattern = /^[0-9]+$/;

export const personalInformationSchema = yup.object().shape({
  date_register_from_form: yup
    .string()
    .required('กรุณากรอกวันที่สมัครจากใบสมัครนักเรียน'),
  prename_tha: yup.number().required('กรุณาเลือกคำนำหน้า'),
  firstname_tha: yup
    .string()
    .matches(thaiCharacterPattern, 'ชื่อต้องเป็นภาษาไทย')
    .required('กรุณากรอกชื่อ'),
  lastname_tha: yup
    .string()
    .matches(thaiCharacterPattern, 'นามสกุลต้องเป็นภาษาไทย')
    .required('กรุณากรอกนามสกุล'),
  firstname_eng: yup
    .string()
    .matches(englishCharacterPattern, 'ชื่อต้องเป็นภาษาอังกฤษ')
    .required('กรุณากรอกชื่อ'),
  lastname_eng: yup
    .string()
    .matches(englishCharacterPattern, 'นามสกุลต้องเป็นภาษาอังกฤษ')
    .required('กรุณากรอกนามสกุล'),
  citizenid_card: yup
    .string()
    .matches(numericPattern, 'รหัสประชาชนต้องเป็นตัวเลข')
    .required('กรุณากรอกรหัสประชาชน'),
  birthdate: yup.string().required('กรุณากรอกวันเกิด'),
  marital_status: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .nullable()
    .required('กรุณาเลือกสถานภาพปัจจุบัน'),
  birth_province: yup.number().required('กรุณาเลือกจังหวัดที่เกิด'),
});
