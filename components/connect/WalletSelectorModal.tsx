import React, { FC } from 'react';
import Image from 'next/image';

import { PdModal, PdModalBody } from '@/pdComponents';
import styles from './WalletSelectorModal.module.scss';

interface WalletSelectorModalProps {
  open: boolean;
  // onClose: any;
  onConnect: any;
}

const WalletSelectorModal: FC<WalletSelectorModalProps> = ({
  open,
  onConnect,
}: WalletSelectorModalProps) => (
  <PdModal isOpen={open} className={styles.modalConnect}>
    <PdModalBody className={styles.modalBody}>
      <div className="mb-3 d-flex w-100">
        <div
          className={styles.modalBodyCard}
          onClick={() => onConnect('meta')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onConnect('meta');
          }}
          role="button"
          tabIndex={0}
        >
          <div className="text-center">
            <Image
              className="mx-auto"
              src="/assets/images/metamask.svg"
              width={58}
              height={58}
            />
          </div>
          <span className={styles.modalBodyTitle}>Metamask</span>
          <p className={styles.modalBodyDescription}>
            Connect to your Metamask Account
          </p>
        </div>
        <div
          className={styles.modalBodyCard}
          onClick={() => onConnect('bsc')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onConnect('bsc');
          }}
          role="button"
          tabIndex={0}
        >
          <div className="text-center">
            <Image
              className="d-flex"
              src="/assets/images/binance.svg"
              width={58}
              height={58}
            />
          </div>
          <span className={styles.modalBodyTitle}>Binance Chain Wallet</span>
          <p className={styles.modalBodyDescription}>
            Connect to your Binance chain Account
          </p>
        </div>
      </div>
    </PdModalBody>
  </PdModal>
);

export default WalletSelectorModal;
