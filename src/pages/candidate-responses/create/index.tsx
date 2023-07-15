import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCandidateResponse } from 'apiSdk/candidate-responses';
import { Error } from 'components/error';
import { candidateResponseValidationSchema } from 'validationSchema/candidate-responses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { QuestionInterface } from 'interfaces/question';
import { UserInterface } from 'interfaces/user';
import { getQuestions } from 'apiSdk/questions';
import { getUsers } from 'apiSdk/users';
import { CandidateResponseInterface } from 'interfaces/candidate-response';

function CandidateResponseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CandidateResponseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCandidateResponse(values);
      resetForm();
      router.push('/candidate-responses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CandidateResponseInterface>({
    initialValues: {
      response: '',
      question_id: (router.query.question_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: candidateResponseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Candidate Response
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="response" mb="4" isInvalid={!!formik.errors?.response}>
            <FormLabel>Response</FormLabel>
            <Input type="text" name="response" value={formik.values?.response} onChange={formik.handleChange} />
            {formik.errors.response && <FormErrorMessage>{formik.errors?.response}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<QuestionInterface>
            formik={formik}
            name={'question_id'}
            label={'Select Question'}
            placeholder={'Select Question'}
            fetcher={getQuestions}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.content}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'candidate_response',
    operation: AccessOperationEnum.CREATE,
  }),
)(CandidateResponseCreatePage);
