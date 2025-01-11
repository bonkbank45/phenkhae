import * as yup from 'yup';

export default yup.object().shape({
  course_id: yup
    .number()
    .typeError('กรุณาเลือกหลักสูตร')
    .required('กรุณาเลือกหลักสูตร'),
});
