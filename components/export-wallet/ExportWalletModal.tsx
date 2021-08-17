import React, { FC } from 'react';
import Image from 'next/image';

import { PdModal, PdModalBody, PdModalHeader } from '@/pdComponents';
import { Button } from 'reactstrap';
import styles from './ExportWalletModal.module.scss';
import StackedInput from '../reusable/StackedInput';

interface ExportWalletModalProps {
  open: boolean;
  onCopy: any;
  onClose: any;
}

const ExportWalletModal: FC<ExportWalletModalProps> = ({
  open,
  onCopy,
  onClose,
}: ExportWalletModalProps) => (
  <PdModal isOpen={open} className={styles.modalConnect}>
    <PdModalHeader title="Export Wallet" />
    <PdModalBody className={styles.modalBody}>
      <div className="mb-3 d-block w-100 mx-auto">
        <div className="text-center">
          <Image
            className="mx-auto"
            src="/assets/images/qrimg.png"
            width={291}
            height={291}
          />
        </div>
        <StackedInput
          inputClassNames={`${styles.modalInput}`}
          label=""
          readOnly
          name="did"
          placeholder="Copy seed pharse"
          type="text"
          value=""
        />
        <Button
          className={`${styles.modalBtn} btn btn-primary d-block w-100 my-3`}
          color="primary"
          onClick={onCopy}
        >
          Copy
        </Button>
        <Button
          onClick={onClose}
          className={`${styles.modalBtn} vd-block w-100 my-3 btn-link-form-cancel`}
          color="link"
        >
          Close
        </Button>
      </div>
    </PdModalBody>
  </PdModal>
);

export default ExportWalletModal;
