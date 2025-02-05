import * as yup from 'yup';

export const enrollmentStudentEditSchema = yup.object().shape({
  activity_case_status: yup.number().required(),
  enrollment_date: yup.string().required('กรุณากรอกวันที่ลงทะเบียน'),
  date_start: yup.string().required('กรุณากรอกวันที่เริ่มเรียนของนักเรียน'),
  date_end: yup.string().required('กรุณากรอกวันที่สำเร็จการเรียนของนักเรียน'),
  theoretical_score: yup
    .number()
    .notRequired()
    .typeError('คะแนนภาคทฤษฎีต้องเป็นตัวเลข')
    .min(0, 'คะแนนภาคทฤษฎีต้องไม่ต่ำกว่า 0')
    .max(100, 'คะแนนภาคทฤษฎีต้องไม่เกิน 100')
    .nullable(),
  practical_score: yup
    .number()
    .notRequired()
    .typeError('คะแนนภาคปฏิบัติต้องเป็นตัวเลข')
    .min(0, 'คะแนนภาคปฏิบัติต้องไม่ต่ำกว่า 0')
    .max(100, 'คะแนนภาคปฏิบัติต้องไม่เกิน 100')
    .nullable(),
});
