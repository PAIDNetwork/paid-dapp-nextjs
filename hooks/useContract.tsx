import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useWallet } from 'react-binance-wallet';
import SmartAgreementAnchoring from '../contracts/SmartAgreementAnchoring.json';
import TokenEscrow from '../contracts/TokenEscrow.json';
import PaidTokenContract from '../contracts/PaidTokenContract.json';

declare global {
  interface Window {
    ethereum:any;
  }
}

function useContract() {
  const { account, connector, chainId } = useWallet();
  const [contract, setContract] = useState(null);
  const [contractSigner, setContractSigner] = useState(null);
  const [escrowContract, setEscrowContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenSignerContract, setTokenSignerContract] = useState(null);
  const metamask = (window as any).ethereum;
  const binanceWallet = (window as any).BinanceChain;
  let provider;
  if (connector !== 'bsc') {
    provider = new ethers.providers.Web3Provider(metamask, 'any');
  } else {
    provider = new ethers.providers.Web3Provider(binanceWallet);
  }
  useEffect(() => {
    const handleContract = () => {
      const Contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS, SmartAgreementAnchoring.abi, provider,
      );
      setContract(Contract);
    };

    const handleContractSigner = async () => {
      const signer = provider.getSigner(account);
      const ContractSigner = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS,
        SmartAgreementAnchoring.abi,
        signer,
      );
      setContractSigner(ContractSigner);
    };

    const handleEscrowContract = () => {
      const currentContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ESCROW_ADDRESS, TokenEscrow.abi, provider,
      );
      setEscrowContract(currentContract);
    };

    const handleTokenContract = () => {
      const currentContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_PAID_TOKEN_ADDRESS, PaidTokenContract.abi, provider,
      );
      setTokenContract(currentContract);
    };

    const handleTokenSignerContract = () => {
      const signer = provider.getSigner(account);
      const currentContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_PAID_TOKEN_ADDRESS, PaidTokenContract.abi, signer,
      );
      setTokenSignerContract(currentContract);
    };

    handleContract();
    handleContractSigner();
    handleEscrowContract();
    handleTokenContract();
    handleTokenSignerContract();
  }, []); // Empty array ensures that effect is only run on mount

  return {
    contract,
    contractSigner,
    escrowContract,
    tokenContract,
    tokenSignerContract,
  };
}

export default useContract;