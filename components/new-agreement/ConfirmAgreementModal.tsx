import React, { FC, useState } from 'react';
import { PdModal, PdModalBody } from '@/pdComponents';
import helper from '../../utils/helper';
import ReviewAgreementModal from './ReviewAgreementModal';

interface ConfirmAgreementModalProps {
  open: boolean;
  name: string;
  agreementDocument: any;
  onclick: any;
}

const ConfirmAgreementModal: FC<ConfirmAgreementModalProps> = ({
  open, name, agreementDocument, onclick,
}: ConfirmAgreementModalProps) => {
  const [openReviewAgreementModal, setOpenReviewAgreementModal] = useState(false);
  const { formatDate } = helper;
  return (
    <>
      <PdModal isOpen={open} className="confirm-agreement-modal">
        <PdModalBody className="confirm-agreement-modal-body">
          <h1 className="modal-agreement-title mb-4">Agreement</h1>
          <p className="modal-agreement-sub-title">
            You,
            {' '}
            <span>{name}</span>
          </p>
          <p className="modal-agreement-text">
            Have agreed with the conclusion of this transaction on
            {' '}
            <span>{formatDate(new Date())}</span>
            .
          </p>
          <p className="modal-agreement-text">
            And accepted with the signature of these agrrement to
            {' '}
            <span>Counterparty name</span>
            {' '}
            wallet address:
          </p>
          <p className="modal-agreement-text"><span>0x3873faa35694B18b6517fd73f05A1CafDaE4cBdD</span></p>
          <p className="modal-agreement-text mb-5">
            The aggrement is pending for approval for nine days from the date of the offer and will
            not be valid if there is any change in the conditions of the confidentiality agreement.
            {' '}
            <span>Counterparty name</span>
            .
          </p>
          <div className="d-flex justify-content-center mb-3">
            <button
              className="btn btn-primary btn-form-save btn-confirm-modal"
              type="submit"
              onClick={onclick}
            >
              Confirm
            </button>
          </div>
          <div className="d-flex justify-content-center underline">
            <button type="submit" className="btn-review-pdf" onClick={() => setOpenReviewAgreementModal(true)}>
              <p className="modal-agreement-sub-title">
                <span>
                  {' '}
                  <u>Review Agreement in PDF</u>
                  {' '}
                </span>
              </p>
            </button>

          </div>
        </PdModalBody>
      </PdModal>
      <ReviewAgreementModal
        open={openReviewAgreementModal}
        onClick={() => setOpenReviewAgreementModal(false)}
        agreementDocument={agreementDocument}
      />
    </>
  );
};

export default ConfirmAgreementModal;
