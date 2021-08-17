import React, { FC } from 'react';
import { ConnextModal } from '@connext/vector-modal';

type SwapModalProps = {
  showModal: boolean;
  transferAmount?: string;
  loginProvider?: any;
  onClose: () => void;
  onReady?: (params: {
      depositChannelAddress: string;
      withdrawChannelAddress: string;
  }) => any;
  onSwap?: (inputSenderAmountWei: string, node: any) => Promise<void>;
  onDepositTxCreated?: (txHash: string) => void;
  onFinished?: (txHash: string, amountWei: string) => void;
  generateCallData?: (toWithdraw: string, toAssetId: string, node: any) => Promise<{
      callData?: string;
  }>;
};

const SwapModal: FC<SwapModalProps> = ({
  loginProvider,
  showModal,
  onReady,
  onClose,
}) => (
  <div className="swap-modal-wrapper">
    <ConnextModal
      loginProvider={loginProvider}
      showModal={showModal}
      onReady={onReady}
      onClose={onClose}
      withdrawalAddress={process.env.NEXT_PUBLIC_WITHDRAWALADDRESS}
      routerPublicIdentifier={process.env.NEXT_PUBLIC_ROUTERPUBLICIDENTIFIER}
      depositAssetId={process.env.NEXT_PUBLIC_DEPOSITASSETID}
      depositChainProvider={process.env.NEXT_PUBLIC_DEPOSITCHAINPROVIDER}
      withdrawAssetId={process.env.NEXT_PUBLIC_WITHDRAWASSETID}
      withdrawChainProvider={process.env.NEXT_PUBLIC_WITHDRAWCHAINPROVIDER}
    />
  </div>
);

export default SwapModal;
