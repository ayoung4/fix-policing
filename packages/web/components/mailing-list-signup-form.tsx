import React from 'react';
import { FormikProps } from 'formik';
import { Button, Form, Icon } from 'semantic-ui-react';

export type MailingListSignupFormProps = FormikProps<{
    email: string;
}>;

export const MailingListSignupForm: React.FC<MailingListSignupFormProps> =
    ({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        status,
    }) => (
            <Form>
                <Form.Field error={touched.email && !!errors.email}>
                    <Form.Input
                        icon={touched.email && !!errors.email ? 'exclamation' : 'mail'}
                        name='email'
                        type='email'
                        fluid
                        placeholder='myaddress@example.com'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Form.Field>
                <p>{status}</p>
                <Button
                    fluid
                    color='blue'
                    disabled={!!errors.email}
                    onClick={() => handleSubmit()}
                    type='button'
                >
                    {isSubmitting
                        ? (<>
                            <Icon loading name='spinner' />
                        Submitting
                    </>)
                        : touched.email && !!errors.email
                            ? errors.email
                            : 'Join!'}
                </Button>
            </Form>
        );