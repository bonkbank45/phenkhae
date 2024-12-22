import * as yup from 'yup';

export const trainingCourseSchema = yup.object().shape({
  // // At least one course must be selected
  // // อย่างน้อยต้องเลือก 1 คอร์ส
  // courses: yup.object().test(
  //   'at-least-one-course',
  //   'Please select at least one course', // ต้องเลือกอย่างน้อย 1 คอร์ส
  //   (value) => {
  //     if (!value) return false;
  //     return Object.values(value).some((selected) => selected === true);
  //   },
  // ),
});
