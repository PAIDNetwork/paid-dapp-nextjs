import React, { FC } from 'react';
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
}

const AgreementDetailModal: FC<DetailAgreementModalProps> = ({
  currentAgreement,
  open,
  onClose,
}: DetailAgreementModalProps) => {
  const statusButtonClass = classNames('btn-status mr-3', {
    'btn-danger': currentAgreement?.status === agreementStatus.DECLINED,
    'btn-success': currentAgreement?.status === agreementStatus.SIGNED,
    'btn-info': currentAgreement?.status === agreementStatus.PENDING,
  });

  const titleStatus = { 1: 'Pending', 2: 'Declined', 3: 'Signed' };

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
        <h5>Consulting Agreement Details:</h5>
        <p className="info">Expires in 9 days</p>
      </ModalHeader>
      <ModalBody>
        <div className="status">
          <span className="title mr-2">Status: </span>
          <Button className={statusButtonClass}>{titleStatus[currentAgreement?.status]}</Button>
        </div>
        <div className="row details">
          <div className="col-12 info mb-4 info mt-3 mb-2"> Details: </div>
          <div className="col-6 mb-3 flex-column">
            <p className="title mb-1">Counterparty:</p>
            <div className="value">{currentAgreement?.name}</div>
          </div>
          <div className="col-6 mb-3 ">
            <p className="title mb-1">Signed By:</p>
            <div className="value">0x9e81de93dC...47e6d64b70ff1dF</div>
          </div>
          <div className="col-6 mb-3  flex-column">
            <p className="title mb-1">Last Modified:</p>
            <div className="value">{currentAgreement?.lastModified}</div>
          </div>
          <div className="col-6 mb-3 ">
            <p className="title mb-1">Transaction Hash:</p>
            <div className="value">0x9e81de93dC...47e6d64b70ff1dF</div>
          </div>
          <div className="col-6 mb-3  flex-column">
            <p className="title mb-1">Created:</p>
            <div className="value">{currentAgreement?.createdDate}</div>
          </div>
          <div className="col-6 mb-3 ">
            <p className="title mb-1">Document Signature:</p>
            <div className="value">0x9e81de93dC...47e6d64b70ff1dF</div>
          </div>
          <div className="col-12 mb-3  flex-column">
            <p className="title mb-1">Signed On:</p>
            <div className="value">{currentAgreement?.signedOn}</div>
          </div>
          <div className="col-12 text-center mt-4 mx-auto buttons px-1">
            <Button
              className="btn-transparent mr-1"
              color="primary"
              onClick={() => onClose()}
            >
              Close
            </Button>
            <Button className="btn btn-action mr-1">Open PDF</Button>
            <Button className="mr-1" color="success">
              Sign Agreement
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AgreementDetailModal;