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
import ProfileStateModel from '@/models/profileStateModel';
import { array } from 'prop-types';
import Table from '../components/agreements/Table';

import TemplateAgreementSelectorModal from '../components/agreements/TemplateAgreementSelectorModal';
import AgreementDetailModal from '../components/agreements/AgreementDetailModal';

import loadAgreements, { updateAgreement } from '../redux/actions/agreement';
import { agreementStatus, columnsAgreement } from '../utils/agreement';
import AgreementModel from '../models/agreementModel';
import dataAgreementModel from '@/models/dataAgreementModel';
import EventAgreementModel from '@/models/eventAgreementModel';

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
        myEvents.map((myEvent) => {
          const newAgreement = {} as AgreementModel;
          newAgreement.data = {} as dataAgreementModel;
          newAgreement.event = {} as EventAgreementModel;
          newAgreement.data.counterpartyName = myEvent.args.proposer;
          newAgreement.data.documentName = myEvent.args.proposerDID;
          newAgreement.event.updatedAt = myEvent.args.recipient;
          newAgreement.event.createdAt = myEvent.args.recipientDID;
          newAgreement.event.status = 1;
          newAgreements.push(newAgreement);
        });
        dispatch(loadAgreements(newAgreements));
        // myEvents.map(async (myEvent) => {
        //   const counterPArty = await contract.counterparties(myEvent.args.documentId.hash, myEvent.args.recipient);
        //   console.log('counter', counterPArty);
        //   const myDocument = await contract.anchors(myEvent.args.documentId.hash);
        //   console.log(myDocument);
        // });
        // if (myDocument.fileHash) {
        //   const item = await ipfs.getObject(myDocument.fileHash);
        //   console.log('templateId', ethers.utils.parseBytes32String(myDocument.templateId));
        //   console.log('item', item);
        // }
        // const items = currentEvents?.map((currentEevent) => ipfs.getObject(currentEevent.args.documentId));
        // const forkedItems = forkJoin(items)
        //   .pipe(debounce((x) => x as any))
        //   .toPromise();

        // this.items = (await forkedItems) || [];
        // this.items = this.items.map((folder, i) => ({
        //   folder: folder.value.documents,
        //   id: i,
        // }));
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
