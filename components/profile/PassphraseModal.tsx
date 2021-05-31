import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { PdModal, PdModalBody } from '@/pdComponents';
import PdAlert from '../reusable/pdAlert';
import StackedInput from '../reusable/StackedInput';

interface PassphraseModalProps {
  open: boolean;
  errorPassphrase: boolean;
  setPassphrase: any;
}

const PassphraseModal: FC<PassphraseModalProps> = ({
  open,
  errorPassphrase,
  setPassphrase,
}: PassphraseModalProps) => {
  const {
    register, errors, handleSubmit,
  } = useForm();

  const onSubmit = (values) => {
    setPassphrase(values.passphrase);
  };

  return (
    <PdModal isOpen={open}>
      <PdModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StackedInput
            label="Passphrase:"
            name="passphrase"
            type="password"
            placeholder="Enter your Passphrase"
            inputClassNames={classNames({ 'is-invalid': errors.passphrase })}
            innerRef={register({
              required: 'Passphrase is required',
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

          {errorPassphrase && (
          <PdAlert
            className="my-5"
            color="danger"
            message="Passphrase invalid"
          />
          )}
          <div className="d-flex justify-content-end">
            <>
              <button className="btn btn-primary btn-form-save" type="submit">
                Accept
              </button>
            </>
          </div>
        </form>
      </PdModalBody>
    </PdModal>
  );
};

export default PassphraseModal;
