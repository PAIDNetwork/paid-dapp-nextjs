import React from 'react';
import { Badge, BadgeProps } from 'reactstrap';
import styles from './PdBadge.module.scss';

const PdBadge: React.FC<BadgeProps> = ({ className, ...props }) => {
  let customColorClass = '';
  switch (props.color) {
    case 'warning':
      customColorClass = styles.pdBadgeWarning;
      break;
    case 'success':
      customColorClass = styles.pdBadgeSuccess;
      break;
    default:
      customColorClass = '';
      break;
  }
  return (
    <Badge
      className={`${styles.pdBadge} ${customColorClass} ${className}`}
      {...props}
    />
  );
};

export default PdBadge;
