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
import ProfileStateModel from '@/models/profileStateModel';
import PreviewDocument from '@/components/new-agreement/PreviewDocument';
import { setAgreementReviewed, setIsEditing } from 'redux/actions';
import templateAgreements from 'data/templateAgreements';
import useContract from 'hooks/useContract';
import { useWallet } from 'react-binance-wallet';
import { IPLDManager } from 'xdv-universal-wallet-core';
import { ethers } from 'ethers';
import ConfirmAgreementModal from '@/components/new-agreement/ConfirmAgreementModal';
import ModalAlert from '@/components/reusable/modalAlert/ModalAlert';
import CID from 'cids';
import PdScrollbar from '../components/reusable/pdScrollbar/PdScrollbar';
import SmartAgreementFormPanel from '../components/new-agreement/SmartAgreementFormPanel';
import getContractTemplate from '../redux/actions/template/index';

import {
  doSetSmartAgreementData,
  resetTemplateAgreement,
} from '../redux/actions/smartAgreement';
import {
  PARTY_ADDRESS_FIELD,
  PARTY_EMAIL_FIELD,
  PARTY_NAME_FIELD,
  PARTY_WALLET_FIELD,
  COUNTER_PARTY_ADDRESS_FIELD,
  COUNTER_PARTY_EMAIL_FIELD,
  COUNTER_PARTY_NAME_FIELD,
  COUNTER_PARTY_WALLET_FIELD,
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
    name, email, did,
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
  const [templateTitle, setTitle] = useState('');
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [agreementDocument, setAgreementDocument] = useState('');
  const [agreementData, setAgreementData] = useState(null);
  const [currentFormData, setCurrentFormData] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [tooltipEditTitle, setTooltipEditTitle] = useState(false);
  const [tooltipIconEdit, setTooltipIconEdit] = useState(false);
  const [agreementTitle, setAgreementTitle] = useState('Untitled Agreement');
  const [openConfirmAgreementModal, setOpenConfirmAgreementModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [agreementError, setAgreementError] = useState(null);
  const [inReview, setReview] = useState(false);

  const {
    register, errors, handleSubmit,
  } = useForm();

  const { account } = useWallet();
  const {
    contract,
    contractSigner,
    tokenContract,
    tokenSignerContract,
  } = useContract();

  useEffect(() => {
    const templateData = getContractTemplate(templateTypeCode, isEditing, agreementReviewed);
    setDataName(templateData.dataName);
    setTitle(templateData.title);
    setAgreementDocument(templateData.template);
    setJsonSchema(templateData.jsonSchemas);
    setUISchema(templateData.uiSchema);
  }, [templateTypeCode, smartAgreementsState]);

  useEffect(() => {
    const data = smartAgreementsState[dataName];
    if (data) {
      data[PARTY_NAME_FIELD] = name;
      data[PARTY_EMAIL_FIELD] = email;
      data[PARTY_ADDRESS_FIELD] = '';
      data[PARTY_WALLET_FIELD] = currentWallet;
      data[COUNTER_PARTY_NAME_FIELD] = '';
      data[COUNTER_PARTY_EMAIL_FIELD] = '';
      data[COUNTER_PARTY_ADDRESS_FIELD] = '';
      data[COUNTER_PARTY_WALLET_FIELD] = '';
      data[COUNTER_PARTY_WALLET_FIELD] = '';
      setAgreementData(data);
    }
  }, [dataName])

  useEffect(() => {
    const data = smartAgreementsState[dataName];
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

  const cleanFormOptionalsFields = (finalReview?: boolean) => {
    const showField = (finalReview) ? ' ' : '';
    const data = Object.keys(smartAgreementsState[dataName]).reduce((x: any, xs: string) => {
      if (!x[xs]) x[xs] = showField
      return x
    }, smartAgreementsState[dataName]);
    setAgreementData(data);
  }

  const onReview = () => {
    const activePageLength = (activePageIndex + 1);
    if (activePageLength === jsonSchemas.length) {
      cleanFormOptionalsFields(true);
      dispatch(setIsEditing(false));
      setReview(true);
      dispatch(setAgreementReviewed(true));
      return
    } else if (activePageLength === jsonSchemas.length - 1) {
      cleanFormOptionalsFields(false);
    }

    setActivePageIndex((index) => index + 1);
  };

  const onSubmitTitle = (values) => {
    setAgreementTitle(values.title);
    setEditTitle(false);
  };

  const toIpfs = async (): Promise<CID> => {
    const ipfsManager = new IPLDManager(did);
    await ipfsManager.start(process.env.NEXT_PUBLIC_IPFS_URL);
    const fil = Buffer.from(renderToString(agreementTemplate()));
    try {
      return ipfsManager.addSignedObject(fil,
        {
          name: agreementTitle,
          contentType: 'text/html',
          lastModified: new Date(),
        });
    } catch (err) {
      return null;
    }
  };

  const onSubmitForm = async () => {
    try {
      let cid = null;
      while (!cid) {
        cid = await toIpfs();
      }

      const types = [];
      const values = [];
      jsonSchemas.forEach((jsonSchema) => {
        const { properties } = jsonSchema;
        Object.keys(properties).forEach((objKey) => {
          if (properties[objKey].type === 'number') {
            types.push('uint');
            values.push(currentFormData[objKey]);
          }
          if (properties[objKey].type === 'string') {
            types.push('string');
            values.push(currentFormData[objKey]);
          } else {
            types.push('string');
            values.push(currentFormData[objKey]);
          }
        });
      });
      const metadata = ethers.utils.defaultAbiCoder.encode(
        types,
        values,
      );

      const fee = await contract.fee();
      const escrowAddress = await contract.escrow();
      await tokenSignerContract.increaseAllowance(escrowAddress, fee.toString());
      const proposerDID = did.id;
      const recipientAddresses = [agreementData.counterPartyWallet];
      const recipientDIDs = [agreementData.counterPartyDid];
      const filehash = cid.toString();
      const requiredQuorum = '1';
      const templateId = templateTypeCode;
      const validUntil = Math.floor(Date.now() / 1000) + 31557600;
      const tx = await contractSigner.addDocument(
        proposerDID,
        recipientAddresses,
        recipientDIDs,
        filehash,
        requiredQuorum,
        templateId,
        metadata,
        validUntil,
        {
          gasLimit: 3000000,
          gasPrice: (1000000000 * 30),
        },
      );
      setOpenConfirmAgreementModal(true);
      await tx.wait();
    } catch (error) {
      console.log(error);
      setAgreementError(error.error);
      setOpenAlertModal(true);
    }
  };

  const confirmDocument = () => {
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
            {!editTitle
              ? (
                <>
                  {!isEditing
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
                      title={templateTitle}
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
              <ConfirmAgreementModal
                open={openConfirmAgreementModal}
                agreementData={agreementData}
                agreementDocument={agreementDocument}
                name={name}
                onclick={confirmDocument}
              />
              <ModalAlert
                open={openAlertModal}
                onClose={() => setOpenAlertModal(false)}
                message={agreementError}
              />
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
