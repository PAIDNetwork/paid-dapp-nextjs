import React, {FC, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import classNames from 'classnames';
import StackedInput from '../reusable/StackedInput';
import StackedPassword from "@/components/reusable/StackedPassword";
import ProfileModel from '../../models/profileModel';

interface FormAccountProps {
    setProfile: any;
    profile: any;
}

const FormAccount: FC<FormAccountProps> = ({
   setProfile,
   profile,
}: FormAccountProps) => {
    const {
        register, errors, handleSubmit, watch,
    } = useForm();
    const passphrase = useRef({});
    passphrase.current = watch('passphrase', '');
    const onSubmit = (values: ProfileModel) => {
        setProfile(values);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <StackedInput
                    label="First name:"
                    name="name"
                    type="text"
                    groupClassNames={classNames('col-sm-12 col-md-6')}
                    placeholder="Enter your first name"
                    inputClassNames={classNames({'is-invalid': errors.name})}
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
                    placeholder="Enter your last name"
                    inputClassNames={classNames({'is-invalid': errors.lastName})}
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
            <StackedInput
                label="Email:"
                name="email"
                type="text"
                placeholder="Enter your Email"
                inputClassNames={classNames({'is-invalid': errors.email})}
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

            <StackedPassword
                label="Passphrase:"
                id="account_phrase"
                name="passphrase"
                placeholder="Enter your Passphrase"
                class={classNames({'is-invalid': errors.passphrase})}
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

            <StackedPassword
                label="Confirm Passphrase:"
                id="account_phrase_confirm"
                name="confirmPassphrase"
                placeholder="Enter your Confim Passphrase"
                class={classNames({
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

            <StackedInput
                label="Address:"
                name="address"
                type="text"
                placeholder="Enter your address"
                inputClassNames={classNames({'is-invalid': errors.address})}
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
                <button className="btn btn-danger w-75" type="submit">
                    Save and Continue
                </button>
            </div>
        </form>
    );
};

export default FormAccount;
