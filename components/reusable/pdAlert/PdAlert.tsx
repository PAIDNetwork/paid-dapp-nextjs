import React from 'react';
import { Alert, AlertProps } from 'reactstrap';
import styles from './PdAlert.module.scss';
import PdSvgWarning from '../pdSvgIcon/PdSvgWarning';

const PdAlert: React.FC<AlertProps> = ({ className, message, ...props }) => {
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
      break;
  }
  return (
    <Alert
      className={`${styles.pdAlert} ${customColorClass} ${className}`}
      {...props}
    >
      <>
        <PdSvgWarning className="mr-2" color="danger" />
        {message}
      </>
    </Alert>
  );
};

export default PdAlert;
