import * as yup from 'yup';

export const editBatchSchema = yup.object().shape({
  batch: yup
    .number()
    .typeError('กรุณากรอกตัวเลข')
    .min(1, 'รุ่นหลักสูตรต้องมากกว่าหรือเท่ากับ 1')
    .required(),
  max_students: yup
    .number()
    .typeError('กรุณากรอกตัวเลข')
    .min(1, 'จำนวนนักเรียนที่รับต้องมากกว่าหรือเท่ากับ 1 คน')
    .required(),
  date_start: yup
    .date()
    .typeError('กรุณากรอกวันที่เริ่มหลักสูตร')
    .transform((value, originalValue) => {
      if (originalValue) {
        const [day, month, year] = originalValue.split('/');
        return new Date(year, month - 1, day);
      }
      return value;
    })
    .required(),
  date_end: yup
    .date()
    .typeError('กรุณากรอกวันที่สิ้นสุดหลักสูตร')
    .transform((value, originalValue) => {
      console.log(originalValue);
      if (originalValue) {
        const [day, month, year] = originalValue.split('/');
        return new Date(year, month - 1, day);
      }
      return value;
    })
    .min(
      yup.ref('date_start'),
      'วันที่สิ้นสุดหลักสูตรต้องมากกว่าวันที่เริ่มหลักสูตร',
    )
    .required(),
});
