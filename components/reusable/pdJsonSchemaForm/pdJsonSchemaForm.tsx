// eslint-disable-next-line import/no-unresolved
import React, {
  FC, Fragment,
} from 'react';
import { useSelector } from 'react-redux';
import Form from '@rjsf/core';
import { AjvError } from '@rjsf/core';
import {
  Button,
} from 'reactstrap';
import Wizard from '@/components/wizard/wizard';
import styles from './PdJsonSchemaForm.module.scss';

enum ErrorPropertyType {
  PARTY_EMAIL = '.partyEmail',
  COUNTER_PARTY_EMAIL = '.counterPartyEmail',
  PARTY_WALLET = '.partyWallet',
  COUNTER_PARTY_WALLET = '.counterPartyWallet',
}

interface pdJsonSchemaFormProps {
  type?: string;
  dataName: string;
  title: string;
  jsonSchemas: Array<Object>;
  uiSchema?: Object;
  className?: string;
  onChange: any;
  activePageIndex: number,
  setActivePageIndex: any,
  onSubmit: any;
}

const PdJsonSchemaForm: FC<pdJsonSchemaFormProps> = ({
  dataName,
  title,
  jsonSchemas,
  uiSchema,
  className,
  onChange,
  activePageIndex,
  setActivePageIndex,
  onSubmit,
}) => {
  const smartAgreementsState = useSelector(
    (state: { smartAgreementsReducer: any }) => state.smartAgreementsReducer,
  );

  const widgets = {};

  const goPrevPage = () => {
    setActivePageIndex((index) => index - 1);
  };

  const transformErrors = (errors: AjvError[]) => errors.map((error: AjvError) => {
    if ([ErrorPropertyType.PARTY_EMAIL, ErrorPropertyType.COUNTER_PARTY_EMAIL].some(errorProperty => errorProperty === error.property)) {
      error.message = 'Invalid email';
    }

    if ([ErrorPropertyType.PARTY_WALLET, ErrorPropertyType.COUNTER_PARTY_WALLET].some(errorProperty => errorProperty === error.property)) {
      error.message = 'Invalid Wallet Address';
    }

    return error;
  });

  const ButtonPrev = () => (activePageIndex > 0 ? (
    <Button
      type="submit"
      className="btn btn-link btn-link-form-cancel w-100 text-center"
      color=""
      onClick={goPrevPage}
    >
      Back
    </Button>
  ) : null);
  const ButtonNext = () => (activePageIndex < jsonSchemas.length - 1 ? (
    <Button
      type="submit"
      className="btn w-100 text-center mb-3 btn-form"
      color="danger"
    >
      Next
    </Button>
  ) : (
    <Button
      type="submit"
      className="w-100 text-center mb-3 btn-form"
      color="danger"
    >
      Review
    </Button>
  ));

  return (
    <div className={`${styles.pdForm} ${className}`}>
      <Wizard
        activePageIndex={activePageIndex}
        jsonSchemas={jsonSchemas}
        title={title}
      >
        {jsonSchemas.map((jsonSchema, index) => (
          <Fragment key={index}>
            <Form
              schema={jsonSchema}
              uiSchema={uiSchema}
              widgets={widgets}
              formData={smartAgreementsState[dataName]}
              onSubmit={onSubmit}
              onChange={onChange}
              showErrorList={false}
              transformErrors={transformErrors}
            >
              <ButtonNext />
              <ButtonPrev />
            </Form>
          </Fragment>
        ))}
      </Wizard>
    </div>
  );
};

export default PdJsonSchemaForm;
