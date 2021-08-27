import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import StackedInput from '../reusable/StackedInput';
import ProfileModel from '../../models/profileModel';

interface FormAccountProps {
  login: any;
}

const FormLogin: FC<FormAccountProps> = ({
  login,
}: FormAccountProps) => {
  const {
    register, errors, handleSubmit,
  } = useForm();

  const onSubmit = (values: ProfileModel) => {
    login(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StackedInput
        label="Email:"
        name="email"
        type="text"
        placeholder="Enter your Email"
        inputClassNames={classNames({ 'is-invalid': errors.email })}
        innerRef={register({
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'invalid email',
          },
        })}
        errorComponent={(
          <ErrorMessage
            className="error-message"
            name="email"
            as="div"
            errors={errors}
          />
        )}
      />
      <div className="pt-3 text-center">
        <button className="btn btn-danger w-100" type="submit">
          Login
        </button>
      </div>
    </form>
  );
};

export default FormLogin;
