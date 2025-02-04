import * as yup from 'yup';

export const editBillInfoSchema = yup.object().shape({
  bill_infos_receiver: yup.string().required('กรุณากรอกชื่อผู้รับใบเสร็จ'),
  bill_infos_date: yup
    .string()
    .typeError('กรุณากรอกวันที่ใบเสร็จ')
    .required('กรุณากรอกวันที่ใบเสร็จ'),
});
