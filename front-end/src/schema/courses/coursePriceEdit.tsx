import * as yup from 'yup';

export const coursePriceEditSchema = yup.object().shape({
  new_price: yup
    .number()
    .typeError('กรุณากรอกราคา')
    .min(0, 'ราคาต้องมากกว่า 0')
    .required('กรุณากรอกราคา'),
});
