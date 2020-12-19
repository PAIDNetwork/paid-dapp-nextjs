import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AgreementContract } from '../contracts/agreement.js';



export class ContractFactory {

	private static _agreementContract: Contract | null = null;

	// Get agreement contract
	public static getAgreementContract = (web3: Web3, network: string) => {
		if (!ContractFactory._agreementContract) {
			ContractFactory._agreementContract = new web3.eth.Contract(
				AgreementContract.raw.abi as any,
				AgreementContract.address[network]
			);
			//console.log(AgreementContract.address[network], ContractFactory._agreementContract);
		}
		//console.log(ContractFactory._agreementContract);
		return ContractFactory._agreementContract;
	};
}
