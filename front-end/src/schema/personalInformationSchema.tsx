import * as yup from 'yup';

// Regular expression to match Thai characters
const thaiCharacterPattern = /^[ก-๙\s]+$/;

// Regular expression to match English characters
const englishCharacterPattern = /^[A-Za-z\s]+$/;

// Regular expression to match numeric characters
const numericPattern = /^[0-9]+$/;

export const personalInformationSchema = yup.object().shape({
  prename_tha: yup.number().required('Prefix name is required'),
  firstname_tha: yup
    .string()
    .matches(thaiCharacterPattern, 'First name must be in Thai')
    .required('First name is required'),
  lastname_tha: yup
    .string()
    .matches(thaiCharacterPattern, 'Last name must be in Thai')
    .required('Last name is required'),
  firstname_eng: yup
    .string()
    .matches(englishCharacterPattern, 'First name must be in English')
    .required('First name is required'),
  lastname_eng: yup
    .string()
    .matches(englishCharacterPattern, 'Last name must be in English')
    .required('Last name is required'),
  citizenid_card: yup
    .string()
    .matches(numericPattern, 'Citizen ID must be numeric')
    .required('Citizen ID is required'),
  birthdate: yup.string().required('Birthday is required'),
  marital_status: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .nullable()
    .required('Marital status is required'),
  birth_province: yup.number().required('Birth province is required'),
});
