import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { IPLDManager } from 'xdv-universal-wallet-core';
import { Card, Button } from 'reactstrap';
import { useWallet } from 'react-binance-wallet';
import useContract from 'hooks/useContract';
import AgreementPreviewModal from '@/components/agreements/AgreementPreviewModal';
import { ethers } from 'ethers';
import { forkJoin } from 'rxjs';
import { debounce } from 'rxjs/operators';
import ProfileStateModel from '@/models/profileStateModel';
import getContractTemplate from '../redux/actions/template';
import Table from '../components/agreements/Table';

import TemplateAgreementSelectorModal from '../components/agreements/TemplateAgreementSelectorModal';
import AgreementDetailModal from '../components/agreements/AgreementDetailModal';

import loadAgreements, { updateAgreement } from '../redux/actions/agreement';
import { agreementStatus, columnsAgreement, COUNTER_PARTY_NAME_FIELD } from '../utils/agreement';
import helper from '../utils/helper';
import AgreementModel from '../models/agreementModel';
import dataAgreementModel from '@/models/dataAgreementModel';
import EventAgreementModel from '@/models/eventAgreementModel';
import { any } from 'prop-types';

const Agreements: React.FC = () => {
  const columns = React.useMemo(() => columnsAgreement, []);
  const dispatch = useDispatch();
  const agreements = useSelector(
    (state: any) => state.agreementReducer.agreements,
  );
  const { did } = useSelector(
    (state: { profileReducer: ProfileStateModel }) => state.profileReducer.profile,
  );
  const { account } = useWallet();
  const { contract } = useContract();
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [currentAgreement, setCurrentAgreement] = useState<AgreementModel>(
    null,
  );
  useEffect(() => {
    const fetchDocuments = async () => {
      if (account && contract) {
        const ipfs = new IPLDManager(did);
        await ipfs.start(process.env.NEXT_PUBLIC_IPFS_URL);

        const filter = contract.filters.SignatureRequested(account);
        const events = await contract.queryFilter(filter);
        const filterRec = contract.filters.SignatureRequested(null, null, account);
        const eventsRec = await contract.queryFilter(filterRec);
        const myEvents = [...events, ...eventsRec];
        console.log('fetchDocuments ==>', myEvents);
        const newAgreements = [];
        const documents = myEvents.map((myEvent) => contract.anchors(myEvent.args.documentId));
        const forkedDocuments = forkJoin(documents).pipe(debounce((x) => x as any)).toPromise();
        const myDocuments = (await forkedDocuments) || [];
        const ipfsItems = myDocuments.map((myDocument: any) => ipfs.getObject(myDocument.fileHash));
        const forkedIpfsItems = forkJoin(ipfsItems).pipe(debounce((x) => x as any)).toPromise();
        const myIpfsItems = (await forkedIpfsItems) || [];
        let index = 0;
        myDocuments.map((myDocument: any) => {
          const { templateId, metadata } = myDocument;
          const templateIdStr = helper.padLeadingZeros(templateId.toString(), 3);
          const templateData = getContractTemplate(templateIdStr);
          const { jsonSchemas } = templateData;
          try {
            const types = [];
            let propsIndex = 0;
            let counterPartyNameIndex = 0;
            jsonSchemas.forEach((jsonSchema) => {
              const { properties } = jsonSchema;
              Object.keys(properties).forEach((objKey) => {
                if (properties[objKey].custom === 'address') {
                  types.push('address');
                } else {
                  types.push(properties[objKey].type);
                }
                if (objKey === COUNTER_PARTY_NAME_FIELD) {
                  counterPartyNameIndex = propsIndex;
                }
                propsIndex += 1;
              });
            });
            const values = ethers.utils.defaultAbiCoder.decode(types, metadata);
            const newAgreement = {} as AgreementModel;
            newAgreement.data = {} as dataAgreementModel;
            newAgreement.event = {} as EventAgreementModel;
            newAgreement.transactionHash = myEvents[index].transactionHash;
            newAgreement.data.counterpartyName = values[counterPartyNameIndex];
            newAgreement.data.documentName = myIpfsItems[index]?.value.name;
            newAgreement.data.toSigner = myEvents[index].args.recipient;
            newAgreement.data.fileString = atob(myIpfsItems[index]?.value.content);
            newAgreement.event.updatedAt = helper.formatDate(new Date());
            newAgreement.event.createdAt = helper.formatDate(new Date());
            newAgreement.event.cid = myDocument.fileHash;
            newAgreement.event.status = myDocument.status;
            newAgreements.push(newAgreement);
            console.log('agreement', newAgreement);
          } catch (e) {
            console.log(e);
          }
          index += 1;
        });
        dispatch(loadAgreements(newAgreements));
      }
    };
    fetchDocuments();
  }, [account, contract, currentAgreement]);

  const onCloseTemplateSelector = () => {
    setOpenTemplateSelector(false);
  };

  const onClosePreviewModal = () => {
    setOpenPreviewModal(false);
  };

  const onCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const onSignAgreement = () => {
    const agreementToUpdate = currentAgreement;
    agreementToUpdate.event.status = agreementStatus.SIGNED;
    // TODO: Helper
    agreementToUpdate.event.signedOn = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).format(new Date());
    dispatch(updateAgreement(currentAgreement?.event.cid, agreementToUpdate));
    setOpenDetailModal(false);
  };

  const onRejectAgreement = () => {
    const agreementToUpdate = currentAgreement;
    agreementToUpdate.event.status = agreementStatus.DECLINED;
    dispatch(updateAgreement(currentAgreement?.event.cid, agreementToUpdate));
    setOpenDetailModal(false);
  };

  const onDetailClick = (currentId: number) => {
    setCurrentAgreement(
      agreements.find(({ event }) => event.cid === currentId),
    );
    setOpenDetailModal(true);
  };

  const onOpenFile = (id: number) => {
    if (id) {
      setCurrentAgreement(
        agreements.find(({ event }) => event.cid === id),
      );
    }
    setOpenDetailModal(false);
    setOpenPreviewModal(true);
  };

  const onNewAgreementClick = () => {
    setOpenTemplateSelector(true);
  };

  return (
    <>
      <Head>
        <title>Paid-Dapp Agreeements</title>
        <link rel="icon" href="/assets/icon/.ico" />
      </Head>

      <div className="agreements m-0 p-0 px-4 container-fluid">
        <div className="row m-0 p-0 h-100">
          {agreements.length > 0
            && (
            <div className="col-12 py-4 d-flex">
              <h3 className="d-flex mr-auto">Smart Agreements</h3>
              <div className="d-flex">
                <Button className="btn-white mr-2" color="primary">
                  Send
                </Button>
                <Button className="btn-white mr-2" color="primary">
                  Received
                </Button>
                <Button className="btn-white mr-2" color="primary">
                  <img src="/assets/icon/filter.svg" alt="" />
                </Button>
                <div className="form-group has-search">
                  <img
                    className="search-icon"
                    src="/assets/icon/search.svg"
                    alt=""
                  />
                  <input
                    type="text"
                    className="form-control input-white"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
            )}
          <div className="col-12">
            <Card className="border-0 content">
              <Table
                columns={columns}
                data={agreements.map((agreement) => ({ ...agreement }))}
                onDetailClick={onDetailClick}
                onNewAgreementClick={onNewAgreementClick}
                onOpenFile={onOpenFile}
              />
              {agreements.length > 0
                && (
                <Button
                  className="new-agreement-button"
                  color="primary"
                  onClick={() => setOpenTemplateSelector(true)}
                >
                  <img className="mr-1" src="/assets/icon/plus.svg" alt="" />
                  New agreement
                </Button>
                )}
            </Card>
          </div>
        </div>
        <TemplateAgreementSelectorModal
          open={openTemplateSelector}
          onClose={onCloseTemplateSelector}
        />
        <AgreementDetailModal
          open={openDetailModal}
          currentAgreement={currentAgreement}
          onClose={onCloseDetailModal}
          onSign={onSignAgreement}
          onReject={onRejectAgreement}
          onOpenPDF={onOpenFile}
        />

        <AgreementPreviewModal
          open={openPreviewModal}
          onClose={onClosePreviewModal}
          fileString={currentAgreement?.data.fileString}
        />
      </div>
    </>
  );
};

export default Agreements;
