import React, { FC } from 'react';
import { PdModal, PdModalBody } from '@/pdComponents';
import Image from 'next/image';
import TemplateComponent from 'react-mustache-template-component';

interface ReviewAgreementModalProps {
  open: boolean;
  onClick: any;
  agreementDocument: any,
}

const ReviewAgreementModal: FC<ReviewAgreementModalProps> = ({
  open,
  onClick,
  agreementDocument,
}: ReviewAgreementModalProps) => (
  <PdModal isOpen={open} className="review-agree-modal confirm-agreement-modal">
    <PdModalBody>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          onClick={onClick}
          className="btn-review-pdf"
        >
          <Image
            src="/assets/icon/close.svg"
            width={15}
            height={15}
          />
        </button>
      </div>
      <TemplateComponent
        template={agreementDocument}
        data={{}}
      />
      <div className="d-flex justify-content-center">
        <button type="button" className="btn btn-danger" onClick={onClick}>Close</button>
      </div>
    </PdModalBody>
  </PdModal>
);

export default ReviewAgreementModal;
