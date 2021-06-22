import React from 'react';
import { PdModal, PdModalHeader, PdModalBody } from '@/pdComponents';
import PdSvgWarning from '../pdSvgIcon/PdSvgWarning';

interface ModalAlertProps {
  open: boolean;
  message: string,
  onClose: any,
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  open, onClose, message,
}) => (
  <PdModal
    isOpen={open}
  >
    <PdModalHeader toggle={onClose} title="" />
    <PdModalBody>
      <PdSvgWarning className="mr-2" color="danger" />
      {message}
    </PdModalBody>
  </PdModal>
);

export default ModalAlert;
