import * as yup from 'yup';

export const massageExperienceSchema = yup.object().shape({
  // no_experience: yup.string().required('กรุณาเลือกประสบการณ์ในการนวด'),
  // has_learn_experience: yup.string().required('กรุณาเลือกประสบการณ์ในการนวด'),
  learn_massage_description: yup.string().when('learn_massage', {
    is: 'เคยนวด/เรียน',
    then: (schema) => schema.required('กรุณากรอกประสบการณ์ในการนวด'),
    otherwise: (schema) => schema.nullable(),
  }),
  // has_work_experience: yup.string().nullable(),
  work_massage_description: yup.string().when('work_massage', {
    is: 'เคยทำงานเกี่ยวข้องกับการนวดไทย',
    then: (schema) => schema.required('กรุณากรอกประสบการณ์ในการนวด'),
    otherwise: (schema) => schema.nullable(),
  }),
});
