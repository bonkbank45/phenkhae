import * as yup from 'yup';

export const courseFormSchema = yup.object().shape({
  id: yup
    .number()
    .typeError('กรุณากรอกไอดีเป็นตัวเลข')
    .min(0, 'ไอดีต้องมากกว่า 0')
    .required('กรุณากรอกไอดีหลักสูตร'),
  course_name: yup.string().required('กรุณากรอกชื่อหลักสูตร'),
  course_description: yup.string().required('กรุณากรอกคำอธิบายหลักสูตร'),
  course_category_id: yup.number().required('กรุณาเลือกประเภทหลักสูตร'),
  course_category_bill_id: yup.number().required('กรุณาเลือกประเภทบิล'),
});
