/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useCallback } from 'react';
import { renderToString } from 'react-dom/server';
import Head from 'next/head';
import { NextPage } from 'next';
import Image from 'next/image';
import router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import TemplateComponent from 'react-mustache-template-component';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { Button, Card, Tooltip } from 'reactstrap';
import { format } from 'date-fns';
import ProfileStateModel from '@/models/profileStateModel';
import PreviewDocument from '@/components/new-agreement/PreviewDocument';
import { setAgreementReviewed, setIsEditing } from 'redux/actions';
import AgreementModel from '@/models/agreementModel';
import templateAgreements from 'data/templateAgreements';
import { createAgreement } from 'redux/actions/agreement';
import PdScrollbar from '../components/reusable/pdScrollbar/PdScrollbar';
import SmartAgreementFormPanel from '../components/new-agreement/SmartAgreementFormPanel';

import getContractTemplate from '../redux/actions/template/index';
import {
  doSetSmartAgreementData,
  resetTemplateAgreement,
} from '../redux/actions/smartAgreement';
import {
  agreementStatus,
  AGREEMENT_TITLE_FIELD,
  AGREEMENT_CREATE_DATE_FIELD,
  PARTY_ADDRESS_FIELD,
  PARTY_EMAIL_FIELD,
  PARTY_NAME_FIELD,
  PARTY_WALLET_FIELD,
  COUNTER_PARTY_ADDRESS_FIELD,
  COUNTER_PARTY_EMAIL_FIELD,
  COUNTER_PARTY_NAME_FIELD,
  COUNTER_PARTY_WALLET_FIELD
} from '../utils/agreement';

type NewAgreementProps = {
  templateTypeCode?: string;
};

const NewAgreement: NextPage<NewAgreementProps> = ({ templateTypeCode }) => {
  if (!templateTypeCode) {
    router.push('agreements');
  }

  const dispatch = useDispatch();

  const smartAgreementsState = useSelector(
    (state: { smartAgreementsReducer: any }) => state.smartAgreementsReducer,
  );

  const isEditing = useSelector(
    (state: { agreementReducer: any }) => state.agreementReducer.isEditing,
  );

  const agreementReviewed = useSelector(
    (state: { agreementReducer: any }) => state.agreementReducer.agreementReviewed,
  );

  const agreements = useSelector(
    (state: any) => state.agreementReducer.agreements,
  );

  const {
    name, email, address,
  } = useSelector(
    (state: { profileReducer: ProfileStateModel }) => state.profileReducer.profile,
  );

  const currentWallet = useSelector(
    (state: { walletReducer: any }) => state.walletReducer.currentWallet,
  );

  const previewColumn = classNames({
    'col-8': isEditing,
    'col-12': !isEditing,
  });

  const onEditMode = () => {
    dispatch(setIsEditing(true));
  };

  const [jsonSchemas, setJsonSchema] = useState([]);
  const [uiSchema, setUISchema] = useState({});
  const [dataName, setDataName] = useState('');
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [agreementDocument, setAgreementDocument] = useState('');
  const [agreementData, setAgreementData] = useState(null);
  const [currentFormData, setCurrentFormData] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [tooltipEditTitle, setTooltipEditTitle] = useState(false);
  const [tooltipIconEdit, setTooltipIconEdit] = useState(false);
  const [agreementTitle, setAgreementTitle] = useState('Untitled Agreement');

  const {
    register, errors, handleSubmit,
  } = useForm();

  useEffect(() => {
    const templateData = getContractTemplate(templateTypeCode);

    setDataName(templateData.dataName);
    setAgreementDocument(templateData.template);
    setJsonSchema(templateData.jsonSchemas);
    setUISchema(templateData.uiSchema);
  }, [templateTypeCode, smartAgreementsState]);

  useEffect(() => {
    const data = smartAgreementsState[dataName];
    if (data) {
      data[AGREEMENT_TITLE_FIELD] = agreementTitle;
      if (data[PARTY_NAME_FIELD] === '') {
        data[PARTY_NAME_FIELD] = `${name}` || 'Your Name';
        data[PARTY_EMAIL_FIELD] = email  || 'Your Email';
        data[PARTY_ADDRESS_FIELD] = address  || 'Your Address';
        data[PARTY_WALLET_FIELD] = currentWallet;
        data[COUNTER_PARTY_NAME_FIELD] = 'Counter Party Name';
        data[COUNTER_PARTY_EMAIL_FIELD] = 'Counter Party Email';
        data[COUNTER_PARTY_ADDRESS_FIELD] = 'Counter Party Address';
        data[COUNTER_PARTY_WALLET_FIELD] = 'Counter Party Wallet';
        data[AGREEMENT_CREATE_DATE_FIELD] = format(new Date(), 'yyyy/MM/dd');
      }
    }
    
    setAgreementData(data);
  }, [smartAgreementsState, dataName, agreementTitle]);

  useEffect(() => () => {
    dispatch(resetTemplateAgreement());
  }, []);

  const agreementTemplate = useCallback(
    () => (
      <div style={{ width: '100%' }}>
        {agreementData ? (
          <TemplateComponent
            template={agreementDocument}
            data={agreementData}
          />
        ) : null}
      </div>
    ),
    [agreementDocument, agreementData],
  );

  const document = useCallback(
    () => templateAgreements.find(({ code }) => code === templateTypeCode),
    [],
  );

  const onChangeFields = ({ formData }) => {
    setCurrentFormData(formData);
    dispatch(
      doSetSmartAgreementData({
        type: templateTypeCode,
        formData,
      }),
    );
  };
  const onReview = () => {
    const activePageLength = (activePageIndex + 1);
    if (activePageLength === jsonSchemas.length) {
      dispatch(setIsEditing(false));
      dispatch(setAgreementReviewed(true));
    } else {
      setActivePageIndex((index) => index + 1);
    }
  };

  const onSubmitTitle = (values) => {
    setAgreementTitle(values.title);
    setEditTitle(false);
  };

  const onSubmitForm = () => {
    let maxCid = 0;
    if (agreements.length) {
      maxCid = Math.max(...agreements.map(({ event }) => event.cid));
    }

    const createdAt = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).format(new Date());

    const newAgreement: AgreementModel = {
      transactionHash:
        '0x2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c',
      event: {
        id: 1,
        from: 1,
        to: 2,
        agreementFormTemplateId: 1,
        cid: maxCid + 1,
        status: agreementStatus.PENDING,
        createdAt,
        updatedAt: createdAt,
      },
      data: {
        documentName: document().name,
        counterpartyName: currentFormData.counterPartyName,
        agreementForm: null,
        agreementFormTemplateId: templateTypeCode,
        escrowed: null,
        validUntil: '12/21/2023',
        toSigner: null,
        fromSigner: null,
        fileString: renderToString(agreementTemplate()),
      },
    };

    dispatch(createAgreement(newAgreement));
    router.push('/agreements');
  };

  return (
    <>
      <Head>
        <title>Paid-Dapp New Agreeement</title>
        <link rel="icon" href="/assets/icon/.ico" />
      </Head>
      <div className="new-agreement m-0 p-0 px-4 container-fluid">
        <div className="row m-0 p-0 h-100">
          <div className="col-12 py-4 d-flex align-items-center">
            { !editTitle
              ? (
                <>
                  { !isEditing
                    ? (
                      <h3 className="d-flex mr-auto">{agreementTitle || 'Untitled Agreement'}</h3>
                    )
                    : (
                      <>
                        <Button id="EditTitle" className="btn-transparent-title" onClick={() => setEditTitle(true)}>
                          <h3 className="d-flex mr-auto title-agreement">
                            {agreementTitle || 'Untitled Agreement'}
                          </h3>
                        </Button>
                        <Button
                          className="btn-transparent-title ml-n2 pt-0"
                          onClick={() => setEditTitle(true)}
                          id="IconEditTitle"
                        >
                          <i className="fa fa-pencil" />
                        </Button>
                        <Tooltip
                          placement="bottom"
                          isOpen={tooltipIconEdit}
                          target="IconEditTitle"
                          toggle={() => setTooltipIconEdit(!tooltipIconEdit)}
                        >
                          Edit title
                        </Tooltip>
                        <Tooltip
                          placement="bottom"
                          isOpen={tooltipEditTitle}
                          target="EditTitle"
                          toggle={() => setTooltipEditTitle(!tooltipEditTitle)}
                        >
                          Edit title
                        </Tooltip>
                      </>
                    )}
                </>
              )
              : (
                <form className="d-flex align-items-center w-100" onSubmit={handleSubmit(onSubmitTitle)}>
                  <div className="title-input mr-2">
                    <input
                      name="title"
                      type="text"
                      placeholder="Enter your title"
                      className={classNames('input-new-agreement pl-3 w-100', {
                        'is-invalid': errors.title,
                      })}
                      defaultValue={agreementTitle}
                      ref={register({
                        required: 'Title is required',
                      })}
                    />
                    <ErrorMessage
                      className="error-message"
                      name="title"
                      as="div"
                      errors={errors}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mr-2 btn-new-agreement"
                  >
                    <Image
                      src="/assets/icon/check.svg"
                      width={15}
                      height={15}
                    />
                  </Button>
                  <Button
                    onClick={() => setEditTitle(false)}
                    className="btn-new-agreement"
                  >
                    <Image
                      src="/assets/icon/close.svg"
                      width={15}
                      height={15}
                    />
                  </Button>
                </form>
              )}
          </div>
          <div className="col-12">
            <div className="row">
              <div className={previewColumn}>
                <Card className="border-0 content">
                  <PreviewDocument
                    templateName={document().name}
                    templateComponent={agreementTemplate()}
                    onEditMode={onEditMode}
                    isEditing={isEditing}
                    agreementReviewed={agreementReviewed}
                    onSubmit={onSubmitForm}
                  />
                </Card>
              </div>
              {isEditing && (
                <div className="col-4">
                  <PdScrollbar noScrollX scrollYHeight={665}>
                    <SmartAgreementFormPanel
                      type={templateTypeCode}
                      dataName={dataName}
                      jsonSchemas={jsonSchemas}
                      activePageIndex={activePageIndex}
                      setActivePageIndex={setActivePageIndex}
                      uiSchema={uiSchema}
                      onChangeFields={onChangeFields}
                      onReview={onReview}
                    />
                  </PdScrollbar>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

NewAgreement.getInitialProps = ({ query }): any => {
  const { templateTypeCode } = query;
  return { templateTypeCode };
};

NewAgreement.propTypes = {
  templateTypeCode: PropTypes.string.isRequired,
};

export default NewAgreement;
