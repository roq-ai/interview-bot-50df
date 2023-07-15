import * as yup from 'yup';

export const candidateResponseValidationSchema = yup.object().shape({
  response: yup.string().required(),
  question_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
