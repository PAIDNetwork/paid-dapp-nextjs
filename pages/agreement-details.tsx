import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'reactstrap';
import classNames from 'classnames';
import AgreementModel from '../models/agreementModel';
import { agreementStatus } from '../utils/agreement';
import AgreementConfirmSignModal from '@/components/agreements/AgreementConfirmSignModal';
import AgreementSignSuccessModal from '@/components/agreements/AgreementSignSuccessModal';


interface DetailAgreementProps {
  currentAgreement: AgreementModel;
}

const AgreementDetails: React.FC<DetailAgreementProps> = ({
  currentAgreement
}: DetailAgreementProps) => {

  const statusButtonClass = classNames('btn-status mr-3', {
    'btn-danger': currentAgreement?.event.status === agreementStatus.DECLINED,
    'btn-success': currentAgreement?.event.status === agreementStatus.SIGNED,
    'btn-info': currentAgreement?.event.status === agreementStatus.PENDING,
  });

  const [openConfirmSignModal, setOpenConfirmSignModal] = useState(false);
  const [openSignSuccessModal, setOpenSignSuccessModal] = useState(false);

  const titleStatus = { 1: 'Pending', 2: 'Declined', 3: 'Signed' };

  const onCloseConfirmSignModal = () => {
    setOpenConfirmSignModal(false);
  };

  const onSign = () => {
    setOpenConfirmSignModal(false);
    setOpenSignSuccessModal(true);
  };

  const onCloseSignSuccessModal = () => {
    setOpenSignSuccessModal(false);
  };

  return (
    <>
      <Head>
        <title>Agreeement Details</title>
        <link rel="icon" href="/assets/icon/.ico" />
      </Head>
      <div className="agreements m-0 p-0 px-4 container-fluid">
        <div className="row m-0 p-0 h-100">
          <div className="col-12 py-4 d-flex">
            <h3 className="d-flex mr-auto">Agreement Details</h3>
          </div>
          <div className="col-12">
            <Card className="border-0 content">
              <div className="row">
                <div className="col-12">
                  <h5>Consulting Agreement Details:</h5>
                  <p className="info">Expires in 9 days</p>

                  <div className="status">
                    <span className="title mr-2">Status: </span>
                    <Button className={'btn-info'}>
                      {titleStatus[1]}
                    </Button>
                  </div>
                </div>
                

              </div>
              <div className="row details">
                <div className="col-12">
                  <h5>Details</h5>
                </div>
                <div className="col-6 mb-3 flex-column">
                  <p className="title mb-1">Counterparty:</p>
                  <div className="value">
                    
                  </div>
                </div>
                <div className="col-6 mb-3 ">
                  <p className="title mb-1">Signed By:</p>
                  <div className="value">0x9e81de93dC...47e6d64b70ff1dF</div>
                </div>
                <div className="col-6 mb-3  flex-column">
                  <p className="title mb-1">Last Modified:</p>
                  <div className="value">
                    {currentAgreement?.event.updatedAt || '-'}
                  </div>
                </div>
                <div className="col-6 mb-3 ">
                  <p className="title mb-1">Transaction Hash:</p>
                  <div className="value">
                    {currentAgreement?.transactionHash || '-'}
                  </div>
                </div>
                <div className="col-6 mb-3  flex-column">
                  <p className="title mb-1">Created:</p>
                  <div className="value">
                    {currentAgreement?.event.createdAt || '-'}
                  </div>
                </div>
                <div className="col-6 mb-3 ">
                  <p className="title mb-1">Document Signature:</p>
                  <div className="value">0x9e81de93dC...47e6d64b70ff1dF</div>
                </div>
                <div className="col-12 mb-3  flex-column">
                  <p className="title mb-1">Signed On:</p>
                  <div className="value">
                    {currentAgreement?.event.signedOn || '-'}
                  </div>
                </div>
                <div className="col-12 text-right mt-4 mx-auto buttons px-1">
                  <Button
                    className="btn-transparent mr-2"
                    color="primary"
                    onClick={() => console.log('close')}
                  >
                    Close
                  </Button>
                  <Button className="btn btn-action mr-2">Open PDF</Button>
                  <Button
                    onClick={() => setOpenConfirmSignModal(true)}
                    className="mr-1"
                    color="success"
                  >
                    Sign Agreement
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
        </div>
      </div>

      <AgreementConfirmSignModal 
        currentAgreement={currentAgreement}
        open={openConfirmSignModal}
        onClose={onCloseConfirmSignModal}
        onSign={onSign}
      />

      <AgreementSignSuccessModal
        open={openSignSuccessModal}
        onClose={onCloseSignSuccessModal}
        />
    </>
  )

}

export default AgreementDetails;