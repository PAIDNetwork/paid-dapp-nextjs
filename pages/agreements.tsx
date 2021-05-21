import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Button } from 'reactstrap';

import AgreementPreviewModal from '@/components/agreements/AgreementPreviewModal';
import Table from '../components/agreements/Table';

import TemplateAgreementSelectorModal from '../components/agreements/TemplateAgreementSelectorModal';
import AgreementDetailModal from '../components/agreements/AgreementDetailModal';

import setOpenMenu from '../redux/actions/menu';
import loadAgreements, { updateAgreement } from '../redux/actions/agreement';
import { agreementStatus, columnsAgreement } from '../utils/agreement';
import AgreementModel from '../models/agreementModel';

const Agreements: React.FC = () => {
  const columns = React.useMemo(() => columnsAgreement, []);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.menuReducer.isOpen);
  const agreements = useSelector(
    (state: any) => state.agreementReducer.agreements,
  );
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [currentAgreement, setCurrentAgreement] = useState<AgreementModel>(
    null,
  );

  useEffect(() => {
    dispatch(loadAgreements());
  }, []);

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
          {agreements.length > 0 &&
            <div className="col-12 py-4 d-flex">
              <span
                tabIndex={0}
                className="d-flex"
                role="button"
                onClick={() => dispatch(setOpenMenu(!isOpen))}
                onKeyDown={() => dispatch(setOpenMenu(!isOpen))}
              >
                <img
                  className="d-inline mr-5 hambunguer"
                  src="/assets/icon/hamburguer.svg"
                  alt=""
                />
              </span>
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
          }
          <div className="col-12">
            <Card className="border-0 content">
              <Table
                columns={columns}
                data={agreements.map((agreement) => ({ ...agreement }))}
                onDetailClick={onDetailClick}
                onNewAgreementClick={onNewAgreementClick}
                onOpenFile={onOpenFile}
              />
              {agreements.length > 0 && 
                <Button
                  className="new-agreement-button"
                  color="primary"
                  onClick={() => setOpenTemplateSelector(true)}
                >
                  <img className="mr-1" src="/assets/icon/plus.svg" alt="" />
                  New agreement
                </Button>
              }
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
