import * as yup from 'yup';

export const addExamSchema = yup.object().shape({
  year: yup.number().typeError('กรุณาระบุปี').required('กรุณาระบุปี'),
  term: yup.number().typeError('กรุณาระบุเทอม').required('กรุณาระบุเทอม'),
  exam_type_id: yup
    .number()
    .typeError('ประเภทการสอบต้องเป็นตัวเลข')
    .required('กรุณาระบุประเภทการสอบ'),
  exam_period: yup
    .number()
    .typeError('การสอบต้องเป็นตัวเลข')
    .required('กรุณาระบุการสอบ'),
  date_start_exam: yup.string().required('กรุณาระบุวันที่เริ่มการสอบ'),
  score_pass: yup.number().typeError('คะแนนผ่านต้องเป็นตัวเลข').required(),
});
