import React, {
    FC, useEffect, useRef, useState,
} from 'react';
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

    const onCopy = (): void => {
    };

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
            email: profile.email,
            lastName: profile.lastName,
            address: profile.address,
            passphrase: profile.passphrase,
            confirmPassphrase: profile.passphrase,
        });
    }, [profile]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <StackedInput
                        label="First name:"
                        name="name"
                        type="text"
                        groupClassNames={classNames('col-sm-12 col-md-6')}
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
                        groupClassNames={classNames('col-sm-12 col-md-6')}
                        placeholder="Enter last name"
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
                </div>
                <div className="row">
                    <StackedInput
                        label="Email:"
                        name="email"
                        type="text"
                        groupClassNames={classNames('col-sm-12 col-md-6')}
                        placeholder="Enter your Email"
                        inputClassNames={classNames({ 'is-invalid': errors.email })}
                        innerRef={register({
                            required: 'Email is required',
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
                        label="Address:"
                        name="address"
                        type="text"
                        groupClassNames={classNames('col-sm-12 col-md-6')}
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
                </div>
                <StackedInput
                    label="Passphrase:"
                    name="passphrase"
                    type="password"
                    placeholder="Enter your Passphrase"
                    inputClassNames={classNames({ 'is-invalid': errors.passphrase })}
                    innerRef={register({
                        minLength: {
                            value: 12,
                            message: 'Passphrase must have 12 characters',
                        },
                    })}
                    groupClassNames="display-none-passphrase"
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
                    placeholder="Enter your Confirm Passphrase"
                    inputClassNames={classNames({
                        'is-invalid': errors.confirmPassphrase,
                    })}
                    innerRef={register({
                        validate: (value) => value === passphrase.current || 'The passwords do not match',
                    })}
                    groupClassNames="display-none-passphrase"
                    errorComponent={(
                        <ErrorMessage
                            className="error-message"
                            name="confirmPassphrase"
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
                            value={profile.did.id}
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
                    <PdAlert
                        className="my-5"
                        color="danger"
                        message="For create your DID, We need to create a DID wallet for you, are you agree?"
                    />
                )}
                <div className="d-flex justify-content-end">
                    <>
                        {/* <button
              className="btn btn-link btn-link-form-cancel mr-5"
              type="button"
              onClick={setCancel}
            >
              Cancel
            </button> */}
                        <button className="btn btn-outline-danger mr-2" type="submit">
                            Edit Profile
                        </button>
                    </>
                    <button
                        className="btn btn-secondary btn-form-img-text-primary"
                        type="button"
                        onClick={onOpenExportModal}
                    >
                        Export Wallet
                    </button>
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
