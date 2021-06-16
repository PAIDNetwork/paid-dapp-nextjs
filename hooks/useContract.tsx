import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import SmartAgreementAnchoring from '../contracts/SmartAgreementAnchoring.json';

declare global {
  interface Window {
    ethereum:any;
  }
}

function useContract() {
  const [contract, setContract] = useState(null);
  const [contractSigner, setContractSigner] = useState(null);
  const { ethereum } = useWallet();
  console.log('eth', ethereum);
  useEffect(() => {
    const handleContract = () => {
      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const Contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS, SmartAgreementAnchoring.abi, provider,
      );
      setContract(Contract);
    };

    const handleContractSigner = async () => {
      await ethereum.send('eth_requestAccounts');
      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const signer = provider.getSigner();
      const ContractSigner = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS,
        SmartAgreementAnchoring.abi,
        signer,
      );
      setContractSigner(ContractSigner);
    };

    handleContract();
    handleContractSigner();
  }, []); // Empty array ensures that effect is only run on mount

  return {
    contract,
    contractSigner,
  };
}

export default useContract;
