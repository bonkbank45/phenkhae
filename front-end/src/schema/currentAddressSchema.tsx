import * as yup from 'yup';

// Regular expression to match numeric characters
const numericPattern = /^[0-9]+$/;

export const currentAddressSchema = yup.object().shape({
  address_num: yup
    .string()
    .matches(numericPattern, 'เลขที่บ้านต้องเป็นตัวเลข')
    .required('กรุณากรอกเลขที่บ้าน'),
  address_moo: yup
    .string()
    .matches(numericPattern, 'หมู่ที่ของบ้านต้องเป็นตัวเลข')
    .nullable(),
  address_soi: yup.string().nullable(),
  address_road: yup.string().nullable(),
  address_province: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .required('กรุณาเลือกจังหวัด'),
  address_district: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .required('กรุณาเลือกอำเภอ'),
  address_sub_district: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .required('กรุณาเลือกตำบล'),
  address_zip_code: yup.string().required('กรุณากรอกรหัสไปรษณีย์'),
  edu_qual: yup.number().nullable(),
  edu_inses: yup.number().nullable(),
});
