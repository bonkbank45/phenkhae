import * as yup from 'yup';

export default yup.object().shape({
  batch: yup.number().typeError('กรุณากรอกหลักสูตรรุ่นที่'),
  course_price: yup.number().typeError('กรุณากรอกราคาหลักสูตร').min(0, 'ไม่สามารถกรอกราคาต่ำกว่า 0 ได้'),
  max_students: yup.number().typeError('กรุณากรอกจำนวนนักเรียนที่รับเข้า').min(0, 'ไม่สามารถกรอกจำนวนต่ำกว่า 0 ได้'),
  date_start: yup
    .date()
    .typeError('กรุณากรอกวันที่เริ่มหลักสูตร')
    .transform((value, originalValue) => {
      if (originalValue) {
        const [day, month, year] = originalValue.split('/');
        return new Date(year, month - 1, day);
      }
      return value;
    }),
  date_end: yup
    .date()
    .typeError('กรุณากรอกวันที่สิ้นสุดหลักสูตร')
    .transform((value, originalValue) => {
      if (originalValue) {
        const [day, month, year] = originalValue.split('/');
        return new Date(year, month - 1, day);
      }
      return value;
    })
    .min(yup.ref('date_start'), 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น'),
});
