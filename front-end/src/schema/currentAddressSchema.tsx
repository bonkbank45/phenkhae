import * as yup from 'yup';

export const currentAddressSchema = yup.object().shape({
  //   address: yup.string().required('กรุณากรอกที่อยู่'),
  //   sub_district: yup.string().required('กรุณากรอกตำบล'),
  //   district: yup.string().required('กรุณากรอกอำเภอ'),
  //   province: yup.string().required('กรุณากรอกจังหวัด'),
  //   zip_code: yup.string().required('กรุณากรอกรหัสไปรษณีย์'),
});
