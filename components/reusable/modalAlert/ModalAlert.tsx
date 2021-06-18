import React from 'react';
import { PdModal, PdModalBody } from '@/pdComponents';
import styles from './ModalAlert.module.scss';
import PdSvgWarning from '../pdSvgIcon/PdSvgWarning';

interface ModalAlertProps {
  open: boolean;
  className: string,
  message: string,
  color: string,
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  open, className, message, ...props
}) => {
  let customColorClass = '';
  switch (props.color) {
    case 'warning':
      customColorClass = styles.pdBadgeWarning;
      break;
    case 'danger':
      customColorClass = styles.pdAlertDanger;
      break;
    case 'success':
      customColorClass = styles.pdBadgeSuccess;
      break;
    default:
      customColorClass = '';
      break;
  }
  return (
    <PdModal
      isOpen={open}
      className={`${styles.pdAlert} ${customColorClass} ${className}`}
      {...props}
    >
      <PdModalBody>
        <PdSvgWarning className="mr-2" color="danger" />
        {message}
      </PdModalBody>
    </PdModal>
  );
};

export default ModalAlert;
