import * as yup from 'yup';

export const addExamSchema = yup.object().shape({
  year: yup.number().typeError('กรุณาระบุปี').required('กรุณาระบุปี').min(1, 'ปีต้องมากกว่าหรือเท่ากับ 1'),
  term: yup.number().typeError('กรุณาระบุเทอม').required('กรุณาระบุเทอม').min(1, 'เทอมต้องมากกว่าหรือเท่ากับ 1'),
  exam_type_id: yup
    .number()
    .typeError('ประเภทการสอบต้องเป็นตัวเลข')
    .required('กรุณาระบุประเภทการสอบ'),
  exam_period: yup
    .number()
    .typeError('การสอบต้องเป็นตัวเลข')
    .required('กรุณาระบุการสอบ'),
  date_start_exam: yup.string().required('กรุณาระบุวันที่เริ่มการสอบ'),
  score_pass: yup
    .number()
    .typeError('คะแนนผ่านต้องเป็นตัวเลข')
    .required('กรุณาระบุคะแนนผ่าน')
    .max(yup.ref('score_full'), 'คะแนนผ่านต้องน้อยกว่าหรือเท่ากับคะแนนเต็ม')
    .min(0, 'คะแนนที่ได้ต้องมากกว่าหรือเท่ากับ 0'),
  score_full: yup
    .number()
    .typeError('คะแนนเต็มต้องเป็นตัวเลข')
    .required('กรุณาระบุคะแนนเต็ม')
    .min(0, 'คะแนนเต็มของการสอบต้องมากกว่าหรือเท่ากับ 0'),
});
