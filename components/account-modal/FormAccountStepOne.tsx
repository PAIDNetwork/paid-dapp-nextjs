import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import StackedInput from '../reusable/StackedInput';
import ProfileModel from '../../models/profileModel';

interface FormAccountStepOneProps {
  setStpe: any;
  setProfile: any;
}

const FormAccountStepOne: FC<FormAccountStepOneProps> = ({
  setStpe,
  setProfile,
}: FormAccountStepOneProps) => {
  const {
    register, errors, handleSubmit,
  } = useForm();
  const onSubmit = (values: ProfileModel) => {
    setProfile(values);
    setStpe(1);
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
      <StackedInput
        label="First name:"
        name="name"
        type="text"
        placeholder="Enter your first name"
        inputClassNames={classNames({ 'is-invalid': errors.name })}
        innerRef={register({
          required: 'First name is required',
        })}
        errorComponent={(
          <ErrorMessage
            className="error-message"
            name="name"
            as="div"
            errors={errors}
          />
                )}
      />
      <StackedInput
        label="Last name:"
        name="lastName"
        type="text"
        placeholder="Enter your last name"
        inputClassNames={classNames({ 'is-invalid': errors.lastName })}
        innerRef={register({
          required: 'Last name is required',
        })}
        errorComponent={(
          <ErrorMessage
            className="error-message"
            name="lastName"
            as="div"
            errors={errors}
          />
                )}
      />
      <StackedInput
        label="Address:"
        name="address"
        type="text"
        placeholder="Enter your address"
        inputClassNames={classNames({ 'is-invalid': errors.address })}
        innerRef={register({
          required: 'Address is required',
        })}
        errorComponent={(
          <ErrorMessage
            className="error-message"
            name="address"
            as="div"
            errors={errors}
          />
        )}
      />
      <div className="pt-3 text-center">
        <button className="btn btn-primary btn-form-save w-75" type="submit">
          Save and Continue
        </button>
      </div>
    </form>
  );
};

export default FormAccountStepOne;
