import * as yup from 'yup';

export const courseGraduateFormSchema = yup.object().shape({
  completion_date: yup.string().required('กรุณากรอกวันที่สำเร็จหลักสูตร'),
  date_start: yup.string().required('กรุณากรอกวันที่เริ่มหลักสูตร'),
  date_end: yup.string().required('กรุณากรอกวันที่จบหลักสูตร'),
  certificate_status: yup.number().required('กรุณากรอกสถานะสำเร็จหลักสูตร'),
  certificate_date: yup.string().when('certificate_status', {
    is: 1,
    then: (schema) => schema.required('กรุณากรอกวันที่รับใบประกาศนียบัตร'),
    otherwise: (schema) => schema.nullable(),
  }),
});
