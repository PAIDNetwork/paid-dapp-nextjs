import React, { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import StackedInput from '../reusable/StackedInput';
import ProfileModel from '../../models/profileModel';
import PdAlert from '../reusable/pdAlert';
import ExportWalletModal from '../export-wallet/ExportWalletModal';

interface FormProfileProps {
  profile: ProfileModel;
  emptyProfile: boolean;
  onSubmit: any;
}

const FormProfile: FC<FormProfileProps> = ({
  profile,
  emptyProfile,
  onSubmit,
}: FormProfileProps) => {
  const [openExportModal, setOpenExportModal] = useState(false);

  const onOpenExportModal = () => {
    setOpenExportModal(true);
  };

  const onCopy = () => {};

  const {
    register, errors, handleSubmit, watch, reset,
  } = useForm<ProfileModel>({
    defaultValues: {
      ...profile,
    },
  });

  const passphrase = useRef({});
  passphrase.current = watch('passphrase', '');

  useEffect(() => {
    reset({
      name: profile.name,
    });
  }, [profile]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StackedInput
          label="Name:"
          readOnly={!emptyProfile}
          name="name"
          type="text"
          placeholder="Enter your Name"
          inputClassNames={classNames({ 'is-invalid': errors.name })}
          innerRef={register({
            required: 'Name is required',
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
        {!emptyProfile && (
          <>
            <StackedInput
              label="DID:"
              readOnly
              name="did"
              type="text"
              value={profile.did}
            />
            <StackedInput
              readOnly
              label="Address: "
              name="address"
              type="text"
              value={profile.address}
            />
            <StackedInput
              readOnly
              label="Created: "
              name="created"
              type="text"
              value={profile.created}
            />
          </>
        )}

        {emptyProfile && (
          <>
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
          </>
        )}

        {emptyProfile && (
          <PdAlert
            className="my-5"
            color="danger"
            message="For create your DID, We need to create a DID wallet for you, are you agree?"
          />
        )}
        <div className="d-flex justify-content-end">
          {emptyProfile ? (
            <>
              {/* <button
              className="btn btn-link btn-link-form-cancel mr-5"
              type="button"
              onClick={setCancel}
            >
              Cancel
            </button> */}
              <button className="btn btn-primary btn-form-save" type="submit">
                Accept
              </button>
            </>
          ) : (
            <button
              className="btn btn-secondary btn-form-img-text-primary"
              type="button"
              onClick={onOpenExportModal}
            >
              Export Wallet
            </button>
          )}
        </div>
      </form>
      <ExportWalletModal
        open={openExportModal}
        onCopy={onCopy}
        onClose={() => setOpenExportModal(false)}
      />
    </>
  );
};

export default FormProfile;
