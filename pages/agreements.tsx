import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
import dataAgreementModel from '@/models/dataAgreementModel';
import EventAgreementModel from '@/models/eventAgreementModel';
import { any } from 'prop-types';
import classNames from 'classnames';
import getContractTemplate from '../redux/actions/template';
import Table from '../components/agreements/Table';

import TemplateAgreementSelectorModal from '../components/agreements/TemplateAgreementSelectorModal';
import AgreementDetailModal from '../components/agreements/AgreementDetailModal';

import loadAgreements, { updateAgreement } from '../redux/actions/agreement';
import { agreementStatus, columnsAgreement, COUNTER_PARTY_NAME_FIELD } from '../utils/agreement';
import helper from '../utils/helper';
import AgreementModel from '../models/agreementModel';

const Agreements: React.FC = () => {
  const router = useRouter();
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
  const [statusFilter, setStatusFilter] = useState(null);
  const [filterSearch, setFilterSearch] = useState('');
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
            console.log('meta ==>', values);
            const newAgreement = {} as AgreementModel;
            newAgreement.data = {} as dataAgreementModel;
            newAgreement.event = {} as EventAgreementModel;
            newAgreement.transactionHash = myEvents[index].transactionHash;
            newAgreement.data.counterpartyName = values[counterPartyNameIndex];
            newAgreement.data.documentName = myIpfsItems[index]?.value.name;
            newAgreement.data.toSigner = myEvents[index].args.recipient;
            newAgreement.data.fileString = atob(myIpfsItems[index]?.value.content);
            newAgreement.event.updatedAt = helper.newFormatDate(new Date());
            newAgreement.event.createdAt = helper.newFormatDate(new Date());
            newAgreement.event.cid = myDocument.fileHash;
            newAgreement.event.status = myDocument.status;
            newAgreements.push(newAgreement);
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
    agreementToUpdate.event.status = agreementStatus.ACCEPTED;
    helper.newFormatDate(new Date());
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
    router.push({
      pathname: '/agreement-details',
      query: {
        data: JSON.stringify(agreements.find(({ event }) => event.cid === currentId)),
      },
    });
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

  const filterStatus = (status) => {
    setStatusFilter(status);
  };
  const SearchAgreements = (e) => {
    setFilterSearch(e.target.value);
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
              <>
                <div className="col-12 py-4 d-flex">
                  <h3 className="d-flex mr-auto">Smart Agreements</h3>
                  <div className="d-flex">
                    <div className="form-group has-search">
                      <img
                        className="search-icon"
                        src="/assets/icon/search.svg"
                        alt=""
                      />
                      <input
                        type="text"
                        className="form-control input-white search-input"
                        placeholder="Search"
                        onChange={SearchAgreements}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-5 ml-4 d-flex">
                  <button
                    type="button"
                    className={classNames(['d-flex mr-1 contract-status-no-filter'], {
                      'contract-status-filter': agreementStatus.DECLINED === statusFilter,
                    })}
                    onClick={() => filterStatus(agreementStatus.DECLINED)}
                  >
                    <div className="circle-contract-status-declined circle-contract-status mr-3" />
                    <span>Declined</span>
                    <span className="ml-3 contract-status-value">
                      {
                        (agreements.filter(
                          (agreement) => agreement.event.status
                          === agreementStatus.DECLINED,
                        )
                        ).length
                      }
                    </span>
                  </button>
                  <button
                    type="button"
                    className={classNames(['d-flex mr-1 contract-status-no-filter'], {
                      'contract-status-filter': agreementStatus.PENDING_SIGNATURE === statusFilter,
                    })}
                    onClick={() => filterStatus(agreementStatus.PENDING_SIGNATURE)}
                  >
                    <div className="circle-contract-status-peding circle-contract-status mr-3" />
                    <span>Pending</span>
                    <span className="ml-3 contract-status-value">
                      {
                        (agreements.filter(
                          (agreement) => agreement.event.status
                          === agreementStatus.PENDING_SIGNATURE,
                        )
                        ).length
                      }
                    </span>
                  </button>
                  <button
                    type="button"
                    className={classNames(['d-flex mr-1 contract-status-no-filter'], {
                      'contract-status-filter': agreementStatus.ACCEPTED === statusFilter,
                    })}
                    onClick={() => filterStatus(agreementStatus.ACCEPTED)}
                  >
                    <div className="circle-contract-status-signed circle-contract-status mr-3" />
                    <span>Signed</span>
                    <span className="ml-3 contract-status-value">
                      {
                        (agreements.filter(
                          (agreement) => agreement.event.status
                          === agreementStatus.ACCEPTED,
                        )
                        ).length
                      }
                    </span>
                  </button>
                </div>
              </>
            )}
          <div className="col-12">
            <Card className="border-0 content">
              <Table
                columns={columns}
                data={agreements.filter(
                  (agreement) => (statusFilter === null || agreement.event.status === statusFilter)
                        && (filterSearch === '' || agreement.data.counterpartyName.includes(filterSearch)
                       || agreement.data.documentName.includes(filterSearch)
                       || agreement.data.counterpartyName.toLowerCase().includes(filterSearch)
                       || agreement.data.documentName.toLowerCase().includes(filterSearch)
                       || agreement.data.counterpartyName.toUpperCase().includes(filterSearch)
                       || agreement.data.documentName.toUpperCase().includes(filterSearch)),
                ).map((agreement) => ({ ...agreement }))}
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
