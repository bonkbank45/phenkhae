import * as yup from 'yup';

const prenameEngRegex = /^[a-zA-Z]+$/;
const prenameThaiRegex = /^[ก-๙]+$/;

export const addPrenameSchema = yup.object().shape({
  id: yup
    .number()
    .typeError('กรุณากรอกรหัสไอดีเป็นตัวเลข')
    .min(0, 'ไอดีต้องมากกว่า 0')
    .required('กรุณากรอกรหัสไอดี'),
  prename_tha: yup
    .string()
    .required('กรุณากรอกคำนำหน้าชื่อ')
    .matches(prenameThaiRegex, 'กรุณากรอกคำนำหน้าชื่อภาษาไทย'),
  prename_eng: yup
    .string()
    .nullable()
    .matches(prenameEngRegex, 'กรุณากรอกคำนำหน้าชื่อภาษาอังกฤษ')
    .transform((value) => (value === '' ? null : value)),
  prename_short_tha: yup
    .string()
    .nullable()
    .matches(prenameThaiRegex, 'กรุณากรอกคำนำหน้าชื่อย่อภาษาไทย')
    .transform((value) => (value === '' ? null : value)),
  prename_short_eng: yup
    .string()
    .nullable()
    .matches(prenameEngRegex, 'กรุณากรอกชำนำหน้าชื่อย่อภาษาอังกฤษ')
    .transform((value) => (value === '' ? null : value)),
  show_status: yup.string().nullable(),
});
