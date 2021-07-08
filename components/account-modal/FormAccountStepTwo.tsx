import React, { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import StackedInput from '../reusable/StackedInput';
import ProfileModel from '../../models/profileModel';

interface FormAccountStepTwoProps {
  setStpe: any;
  setProfile: any;
  profile: any;
}

const FormAccountStepTwo: FC<FormAccountStepTwoProps> = ({
  setStpe,
  setProfile,
  profile,
}: FormAccountStepTwoProps) => {
  const {
    register, errors, handleSubmit, watch,
  } = useForm();
  const passphrase = useRef({});
  passphrase.current = watch('passphrase', '');
  const onSubmit = (values: ProfileModel) => {
    setStpe(2);
    setProfile({ ...values, ...profile });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StackedInput
        label="Passphrase:"
        name="passphrase"
        type="password"
        placeholder="Enter your Passphrase"
        inputClassNames={classNames({ 'is-invalid': errors.passphrase })}
        innerRef={register({
          required: 'Passphrase is required',
          minLength: {
            value: 12,
            message: 'Passphrase must have 12 characters',
          },
        })}
        errorComponent={(
          <ErrorMessage
            className="error-message"
            name="passphrase"
            as="div"
            errors={errors}
          />
                )}
      />
      <StackedInput
        label="Confirm Passphrase:"
        name="confirmPassphrase"
        type="password"
        placeholder="Enter your Confim Passphrase"
        inputClassNames={classNames({
          'is-invalid': errors.confirmPassphrase,
        })}
        innerRef={register({
          validate: (value) => value === passphrase.current || 'The passwords do not match',
        })}
        errorComponent={(
          <ErrorMessage
            className="error-message"
            name="confirmPassphrase"
            as="div"
            errors={errors}
          />
                )}
      />
      <div className="pt-3 text-center">
        <button className="btn btn-primary btn-form-save w-75" type="submit">
          Done
        </button>
      </div>
    </form>
  );
};

export default FormAccountStepTwo;
