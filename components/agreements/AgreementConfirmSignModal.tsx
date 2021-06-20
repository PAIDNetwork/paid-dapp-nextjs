import React, { FC } from 'react';
import {
  Modal, Button, ModalBody,
} from 'reactstrap';

interface AgreementConfirmSignModalProps {
  open: boolean;
  onClose: any;
  onClick: any;
  message: string;
}

const AgreementConfirmSignModal: FC<AgreementConfirmSignModalProps> = ({
  open,
  onClose,
  onClick,
  message,
}: AgreementConfirmSignModalProps) => (
  <>
    <Modal
      isOpen={open}
      toggle={() => onClose()}
      className="confirm-sign-agreement-modal"
    >
      <ModalBody>
        <div className="row details">
          <div className="col-12">
            <p style={{ textAlign: 'center' }}>{message}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Button
              onClick={() => onClick()}
              className="mr-1 col-12"
              color="primary"
            >
              Confirm
            </Button>
          </div>
          <br />
          <br />
          <div className="col-12">
            <Button
              onClick={() => onClose()}
              className="mr-1 col-12"
              color="danger"
            >
              Close
            </Button>
          </div>
        </div>

      </ModalBody>
    </Modal>
  </>
);

export default AgreementConfirmSignModal;
