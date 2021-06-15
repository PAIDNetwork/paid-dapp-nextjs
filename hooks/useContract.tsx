import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import SmartAgreementAnchoring from '../contracts/SmartAgreementAnchoring.json';

declare global {
  interface Window {
    ethereum:any;
  }
}

function useContract() {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const handleContract = () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const Contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS, SmartAgreementAnchoring.abi, provider,
      );
      setContract(Contract);
    };

    handleContract();
  }, []); // Empty array ensures that effect is only run on mount

  return contract;
}

export default useContract;
