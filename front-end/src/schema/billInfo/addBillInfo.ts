import * as yup from 'yup';

export const addBillInfoSchema = yup.object().shape({
  bill_infos_vol: yup.number().typeError('กรุณากรอกตัวเลข').required(),
  bill_infos_no: yup
    .number()
    .typeError('กรุณากรอกตัวเลข')
    .required('กรุณากรอกตัวเลข'),
  bill_infos_receiver: yup.string().required('กรุณากรอกชื่อผู้รับใบเสร็จ'),
  bill_infos_note: yup.string().optional(),
  bill_infos_date: yup
    .string()
    .typeError('กรุณากรอกวันที่ใบเสร็จ')
    .required('กรุณากรอกวันที่ใบเสร็จ'),
});
