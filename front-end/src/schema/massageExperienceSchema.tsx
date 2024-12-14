import * as yup from 'yup';

export const massageExperienceSchema = yup.object().shape({
  has_massage_experience_learn: yup
    .string()
    .required('กรุณาเลือกประสบการณ์ในการนวด'),
  massage_experience_learn_detail: yup
    .string()
    .when('has_massage_experience_learn', {
      is: 'เคยนวด/เรียน',
      then: (schema) => schema.required('กรุณากรอกประสบการณ์ในการนวด'),
      otherwise: (schema) => schema.nullable(),
    }),
  has_massage_experience_work: yup.string().nullable(),
  massage_experience_work_detail: yup
    .string()
    .when('has_massage_experience_work', {
      is: 'เคยทำงานเกี่ยวข้องกับการนวดไทย',
      then: (schema) => schema.required('กรุณากรอกประสบการณ์ในการนวด'),
      otherwise: (schema) => schema.nullable(),
    }),
});
