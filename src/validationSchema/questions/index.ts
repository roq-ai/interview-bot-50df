import * as yup from 'yup';

export const questionValidationSchema = yup.object().shape({
  content: yup.string().required(),
  job_domain_id: yup.string().nullable(),
});
