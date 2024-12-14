import * as yup from 'yup';

export const trainingCourseSchema = yup.object().shape({
  training_course_name: yup.string().required(),
  training_course_detail: yup.string().nullable(),
});
