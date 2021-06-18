import React, { FC } from 'react';
import {
  Modal,  Button, ModalBody,
} from 'reactstrap';
import AgreementModel from '../../models/agreementModel';
import { useState } from 'react';


interface AgreementConfirmSignModalProps {
  currentAgreement: AgreementModel;
  open: boolean;
  onClose: any;
  onSign: any;
}

const AgreementConfirmSignModal: FC<AgreementConfirmSignModalProps> = ({
  currentAgreement,
  open,
  onClose,
  onSign
}: AgreementConfirmSignModalProps) => {

  return(
    <>
      <Modal
      isOpen={open}
      toggle={() => onClose()}
      className="confirm-sign-agreement-modal"
      >
        <ModalBody>
          <div className="row details">
            <div className='col-12'>
              <p style={{textAlign:'center'}}>You’re about to digitally sign the agreement and send to counterparty via email to countersign. Do you want to proceed?</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <Button

                  onClick={() => onSign()}
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
  )

}

export default AgreementConfirmSignModal;
