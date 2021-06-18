import React, { FC, useEffect } from 'react';
import {
  Modal, ModalHeader, Button, ModalBody,
} from 'reactstrap';
import classNames from 'classnames';
import AgreementModel from '../../models/agreementModel';
import ButtonCloseModal from '../reusable/ButtonCloseModal';

import { agreementStatus } from '../../utils/agreement';


interface DetailAgreementModalProps {
  currentAgreement: AgreementModel;
  open: boolean;
  onClose: any;
  onSign: any;
  onReject: any;
  onOpenPDF: any;
}

const AgreementDetailModal: FC<DetailAgreementModalProps> = ({
  currentAgreement,
  open,
  onClose,
  onSign,
  onReject,
  onOpenPDF,
}: DetailAgreementModalProps) => {
  const statusButtonClass = classNames('btn-status mr-3', {
    'btn-danger': currentAgreement?.event.status === agreementStatus.DECLINED,
    'btn-success': currentAgreement?.event.status === agreementStatus.SIGNED,
    'btn-info': currentAgreement?.event.status === agreementStatus.PENDING,
  });

  const titleStatus = { 1: 'Pending', 2: 'Declined', 3: 'Signed' };

  useEffect(() => {
    console.log(currentAgreement);
  }, []);

  return (
    <Modal
      isOpen={open}
      toggle={() => onClose()}
      className="detail-agreement-modal"
    >
      <ModalHeader
        toggle={() => onClose()}
        close={<ButtonCloseModal onClick={() => onClose()} />}
      >
        <span className="title">Consulting Agreement Details:</span>
        <p className="info">Expires in 9 days</p>
      </ModalHeader>
      <ModalBody>
        <div className="status">
          <span className="title mr-2">Status: </span>
          <Button className={statusButtonClass}>
            {titleStatus[currentAgreement?.event.status]}
          </Button>
        </div>
        <div className="row details">
          <div className="col-12 info mb-4 info mt-3 mb-2"> Details: </div>
          <div className="col-6 mb-3 flex-column">
            <p className="title mb-1">Counterparty:</p>
            <div className="value">
              {currentAgreement?.data.counterpartyName}
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
          <div className="col-12 text-center mt-4 mx-auto buttons px-1">
            {currentAgreement?.event.status === agreementStatus.PENDING ? (
              <>
                <Button onClick={() => onOpenPDF()} className="btn btn-action mr-1">Open PDF</Button>
                <Button
                  onClick={() => onReject()}
                  className="mr-1"
                  color="danger"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => onSign()}
                  className="mr-1"
                  color="success"
                >
                  Sign Agreement
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="btn-transparent mr-1"
                  color="primary"
                  onClick={() => onClose()}
                >
                  Close
                </Button>
                <Button className="btn btn-action mr-1">Open PDF</Button>
              </>
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AgreementDetailModal;
