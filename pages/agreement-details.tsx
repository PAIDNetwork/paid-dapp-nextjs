import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWallet } from 'react-binance-wallet';
import { Card, Button } from 'reactstrap';
import classNames from 'classnames';
import AgreementPreviewModal from '@/components/agreements/AgreementPreviewModal';
import AgreementConfirmSignModal from '@/components/agreements/AgreementConfirmSignModal';
import AgreementAcceptedSuccessModal from '@/components/agreements/AgreementAcceptedSuccessModal';
import useContract from '../hooks/useContract';
import AgreementModel from '../models/agreementModel';
import { agreementStatus } from '../utils/agreement';

const AgreementDetails: React.FC = () => {
  const router = useRouter();
  const {
    contract,
    contractSigner,
    tokenSignerContract,
  } = useContract();
  const { data } = router.query;
  const { account } = useWallet();
  const [openConfirmSignModal, setOpenConfirmSignModal] = useState(false);
  const [openConfirmDeclineModal, setOpenConfirmDeclineModal] = useState(false);
  const [openSignSuccessModal, setOpenSignSuccessModal] = useState(false);
  const [openDeclinedSuccessModal, setOpenDeclinedSuccessModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const currentAgreement = JSON.parse(data as string);

  const statusButtonClass = classNames('btn-status mr-3', {
    'btn-danger': currentAgreement?.event.status === agreementStatus.DECLINED,
    'btn-success': currentAgreement?.event.status === agreementStatus.ACCEPTED,
    'btn-info': currentAgreement?.event.status === agreementStatus.PENDING_SIGNATURE,
  });

  const titleStatus = { [agreementStatus.PENDING_SIGNATURE]: 'Pending', [agreementStatus.DECLINED]: 'Declined', [agreementStatus.ACCEPTED]: 'Signed' };

  const onCloseConfirmSignModal = () => {
    setOpenConfirmSignModal(false);
  };

  const onCloseConfirmDeclineModal = () => {
    setOpenConfirmDeclineModal(false);
  };

  const onSign = async () => {
    try {
      const fee = await contract.fee();
      const escrowAddress = await contract.escrow();
      await tokenSignerContract.increaseAllowance(escrowAddress, fee.toString());
      await contractSigner.signAgreement(
        currentAgreement?.event.cid,
        true,
        {
          gasLimit: 3000000,
          gasPrice: (1000000000 * 30),
        },
      );
      setOpenConfirmSignModal(false);
      setOpenSignSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onDecline = async () => {
    try {
      const fee = await contract.fee();
      const escrowAddress = await contract.escrow();
      await tokenSignerContract.increaseAllowance(escrowAddress, fee.toString());
      await contractSigner.signAgreement(
        currentAgreement?.event.cid,
        false,
        {
          gasLimit: 3000000,
          gasPrice: (1000000000 * 30),
        },
      );
      setOpenConfirmDeclineModal(false);
      setOpenDeclinedSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onCloseSignSuccessModal = () => {
    setOpenSignSuccessModal(false);
    router.push('/agreements');
  };

  const onCloseDeclinedSuccessModal = () => {
    setOpenDeclinedSuccessModal(false);
    router.push('/agreements');
  };

  const onOpenFile = () => {
    setOpenPreviewModal(true);
  };

  const onClosePreviewModal = () => {
    setOpenPreviewModal(false);
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
                    <Button className="btn-info">
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
                  <div className="value">{currentAgreement?.data.counterpartyName || '-'}</div>
                </div>
                <div className="col-6 mb-3 ">
                  <p className="title mb-1">Signed By:</p>
                  <div className="value">{currentAgreement?.data.toSigner || '-'}</div>
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
                    onClick={() => router.push('/agreements')}
                  >
                    Close
                  </Button>
                  <Button className="btn btn-action mr-2" onClick={onOpenFile}>Open PDF</Button>
                  {(currentAgreement?.data.toSigner === account
                  && currentAgreement?.event.status === agreementStatus.PENDING_SIGNATURE) && (
                    <>
                      <Button
                        onClick={() => setOpenConfirmDeclineModal(true)}
                        className="mr-1"
                        color="danger"
                      >
                        Declined
                      </Button>
                      <Button
                        onClick={() => setOpenConfirmSignModal(true)}
                        className="mr-1"
                        color="success"
                      >
                        Sign Agreement
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
          <AgreementPreviewModal
            open={openPreviewModal}
            onClose={onClosePreviewModal}
            fileString={currentAgreement?.data.fileString}
          />
        </div>
      </div>

      <AgreementConfirmSignModal
        open={openConfirmSignModal}
        onClose={onCloseConfirmSignModal}
        onClick={onSign}
        message="You’re about to digitally sign the agreement and send to counterparty via email to countersign. Do you want to proceed?"
      />

      <AgreementConfirmSignModal
        open={openConfirmDeclineModal}
        onClose={onCloseConfirmDeclineModal}
        onClick={onDecline}
        message="You’re about to decline the agreement. Do you want to proceed?"
      />

      <AgreementAcceptedSuccessModal
        open={openSignSuccessModal}
        onClose={onCloseSignSuccessModal}
        message="You have successfully approved the agreement."
      />

      <AgreementAcceptedSuccessModal
        open={openDeclinedSuccessModal}
        onClose={onCloseDeclinedSuccessModal}
        message="You have successfully declined the agreement."
      />
    </>
  );
};

export default AgreementDetails;
