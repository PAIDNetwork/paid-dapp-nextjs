import { DocumentsActionTypes } from '../actionTypes/documents';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Agreement from '../../contracts/Agreement.json';
let web3: Web3 | null = null;
let agreementContract: Contract | null = null;
const GETH_URL = '';
const AGREEMENT_ADDRESS = '0x50A9D90013dD4C690ca299f8d79C23b012fB73e3';

const getAgrementContract = () => {
	if (!web3) {
		web3 = new Web3(GETH_URL);
	}

	if (!agreementContract) {
		agreementContract = new web3.eth.Contract(
			Agreement.abi as any,
			AGREEMENT_ADDRESS
		);
	}
	return agreementContract;
};

const getDocuments = (payload: any[]) => {
	return {
		type: DocumentsActionTypes.GET_DOCUMENTS_SUCCESS,
		payload
	};
};
const uploadDocuments = () => {
	return {
		type: DocumentsActionTypes.UPLOAD_DOCUMENTS_SUCCESS
	};
};
const getSelectedDocument = (document: any) => {
	return {
		type: DocumentsActionTypes.GET_SELECTED_DOCUMENT_SUCCESS,
		payload: document || { metadata: {} }
	};
};

const createAgreement = (agreementId: string) => {
	return {
		type: DocumentsActionTypes.CREATE_AGREEMENT_SUCCESS,
		payload: agreementId
	};
};

// ACTIONS
export const doCreateAgreement = (payload: {
	signatoryA: string;
	signatoryB: string;
	validUntil: number;
	multiaddrReference: string;
	agreementFormTemplateId: string;
	agreementForm: string;
	sig: { r: string; s: string; v: string };
	digest: string;
}) => async (dispatch: any) => {
	dispatch({ type: DocumentsActionTypes.CREATE_AGREEMENT_LOADING });
	try {
		// TODO: process data before send to the contract
		const {
			signatoryA,
			signatoryB,
			validUntil,
			multiaddrReference,
			agreementFormTemplateId,
			agreementForm,
			sig,
			digest
		} = payload;
		const { r, s, v } = sig;
		const contract = getAgrementContract();
		const agreement = await contract.methods
			.create({
				signatoryA,
				signatoryB,
				validUntil,
				multiaddrReference,
				agreementFormTemplateId,
				agreementForm,
				r,
				s,
				v,
				digest
			})
			.send();
		dispatch(createAgreement(agreement));
	} catch (err) {
		console.log(err);
		dispatch({
			type: DocumentsActionTypes.CREATE_AGREEMENT_FAILURE,
			payload: err.msg
		});
	}
};

export const doGetDocuments = (wallet: any) => async (dispatch: any) => {
	dispatch({ type: DocumentsActionTypes.GET_DOCUMENTS_LOADING });
	try {
		const { address } = wallet;
		const contract = getAgrementContract();
		const events = await contract.getPastEvents('AgreementCreated', {
			filter: { from: [address], to: [address] },
			fromBlock: 0,
			toBlock: 'latest'
		});

		const agreements = events.map((data) => {
			const {
				returnValues,
				signature,
				logIndex,
				transactionIndex,
				transactionHash,
				blockHash,
				blockNumber,
				address
			} = data;

			return {
				...returnValues,
				signature,
				logIndex,
				transactionIndex,
				transactionHash,
				blockHash,
				blockNumber,
				address
			};
		});

		dispatch(getDocuments(agreements));
	} catch (err) {
		console.log(err);
		dispatch({
			type: DocumentsActionTypes.GET_DOCUMENTS_FAILURE,
			payload: err.msg
		});
	}
};

export const doUploadDocuments = (file: any) => async (dispatch: any) => {
	dispatch({ type: DocumentsActionTypes.UPLOAD_DOCUMENTS_LOADING });
	// const config = {
	//     headers: {
	//         'Content-type': 'application/json'
	//     }
	// };
	try {
		console.log('uploading documents', file);
		// const res = await axios.post(`${API_ENDPOINT}/documents/`, file, config);
		// dispatch(login(res.data);
		setTimeout(function () {
			dispatch(uploadDocuments());
		}, 3000);
	} catch (err) {
		console.log(err);
		dispatch({
			type: DocumentsActionTypes.UPLOAD_DOCUMENTS_FAILURE,
			payload: err.msg
		});
	}
};

export const doGetSelectedDocument = (document: any) => (
	dispatch: any,
	payload: any
) => {
	dispatch(getSelectedDocument({ document }));
};
