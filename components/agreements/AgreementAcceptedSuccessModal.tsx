import React, { FC } from 'react';
import {
  Modal, Button, ModalBody,
} from 'reactstrap';

interface AgreementAcceptedSuccessModalProps {
  open: boolean;
  onClose: any;
  message: string;
}

const AgreementAcceptedSuccessModal: FC<AgreementAcceptedSuccessModalProps> = ({
  open,
  onClose,
  message,
}: AgreementAcceptedSuccessModalProps) => (
  <>
    <Modal
      isOpen={open}
      toggle={() => onClose()}
      className="confirm-sign-agreement-modal"
    >
      <ModalBody>
        <div className="row details">
          <div className="col-12" style={{ textAlign: 'center' }}>
            <img src="/assets/images/success.jpg" width="100" />
          </div>
          <br />
          <br />
          <div className="col-12">
            <p className="text-center">{message}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Button
              onClick={() => onClose()}
              className="mr-1 col-12"
              color="primary"
            >
              OK
            </Button>
          </div>
        </div>

      </ModalBody>
    </Modal>
  </>
);

export default AgreementAcceptedSuccessModal;
