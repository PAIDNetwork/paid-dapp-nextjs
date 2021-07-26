import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useWallet } from 'react-binance-wallet';
import { JsonFragment } from '@ethersproject/abi';
import { getTokenEscrowAbi, getSmartAgreementAnchoringAbi } from '@master-ventures/paid-dapp-contracts';
import { SmartAgreementAnchoring, TokenEscrow } from 'types/typechain';
import PaidTokenContract from '../contracts/PaidTokenContract.json';

declare global {
  interface Window {
    ethereum:any;
  }
}

function useContract() {
  const { account, connector, chainId } = useWallet();
  const [contract, setContract] = useState<SmartAgreementAnchoring>(null);
  const [contractSigner, setContractSigner] = useState<SmartAgreementAnchoring>(null);
  const [escrowContract, setEscrowContract] = useState<TokenEscrow>(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenSignerContract, setTokenSignerContract] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const metamask = (window as any).ethereum;
  const binanceWallet = (window as any).BinanceChain;
  let provider;
  let anchorinngAddress;
  let escrowAddress;
  let paidTokenAddress;
  if (connector !== 'bsc') {
    provider = new ethers.providers.Web3Provider(metamask, 'any');
    anchorinngAddress = process.env.NEXT_PUBLIC_CONTRACT_ETH_ADDRESS;
    escrowAddress = process.env.NEXT_PUBLIC_CONTRACT_ETH_ESCROW_ADDRESS;
    paidTokenAddress = process.env.NEXT_PUBLIC_CONTRACT_ETH_PAID_TOKEN_ADDRESS;
  } else {
    provider = new ethers.providers.Web3Provider(binanceWallet);
    anchorinngAddress = process.env.NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS;
    escrowAddress = process.env.NEXT_PUBLIC_CONTRACT_ESCROW_ADDRESS;
    paidTokenAddress = process.env.NEXT_PUBLIC_CONTRACT_PAID_TOKEN_ADDRESS;
  }
  useEffect(() => {
    const handleNewWorkName = async () => {
      const network = await ethers.providers.getNetwork(chainId);
      setNetworkName(network.name);
    };

    const handleContract = () => {
      const abi = getSmartAgreementAnchoringAbi<JsonFragment>();
      const Contract = new ethers.Contract(
        anchorinngAddress, abi, provider,
      ) as SmartAgreementAnchoring;
      setContract(Contract);
    };

    const handleContractSigner = async () => {
      const signer = provider.getSigner(account);
      const abi = getSmartAgreementAnchoringAbi<JsonFragment>();
      const ContractSigner = new ethers.Contract(
        anchorinngAddress,
        abi,
        signer,
      ) as SmartAgreementAnchoring;
      setContractSigner(ContractSigner);
    };

    const handleEscrowContract = () => {
      const abi = getTokenEscrowAbi<JsonFragment>();
      const currentContract = new ethers.Contract(
        escrowAddress, abi, provider,
      ) as TokenEscrow;
      setEscrowContract(currentContract);
    };

    const handleTokenContract = () => {
      const currentContract = new ethers.Contract(
        paidTokenAddress, PaidTokenContract.abi, provider,
      );
      setTokenContract(currentContract);
    };

    const handleTokenSignerContract = () => {
      const signer = provider.getSigner(account);
      const currentContract = new ethers.Contract(
        paidTokenAddress, PaidTokenContract.abi, signer,
      );
      setTokenSignerContract(currentContract);
    };

    handleNewWorkName();
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
    networkName,
  };
}

export default useContract;
