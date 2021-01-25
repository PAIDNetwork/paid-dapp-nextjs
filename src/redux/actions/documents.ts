// import { KeyStorage } from 'universal-crypto-wallet/dist/key-storage';
// import { KeyStorageModel } from 'universal-crypto-wallet/dist/key-storage/KeyStorageModel';
import { DocumentsActionTypes } from '../actionTypes/documents';
import { BigNumber as BN, ethers } from 'ethers';
import { BlockchainFactory } from '../../utils/blockchainFactory';
import { ContractFactory } from '../../utils/contractFactory';
import { base64StringToBlob } from 'blob-util';
// import { AlgorithmType, CEASigningService, WalletManager } from 'universal-crypto-wallet';
// import { eddsa } from "elliptic";
import { Plugins } from '@capacitor/core';
import * as abiLib  from '../actions/template/abi-utils/abi-lib';
import { DialogsActionTypes } from '../actionTypes/dialogs';
// import { PAIDTokenContract } from '../../contracts/paidtoken';
import { STORAGE_KEY_MY_INFO_KEPT } from '../../utils/constants';

const { Storage } = Plugins;
const uint8ArrayToString = require('uint8arrays/to-string');
const BigNumber = require('bignumber.js');
// const BigNumber = require('ethers');
const ipfsClient = require('ipfs-http-client');
const fetch = require('node-fetch');
const axios = require('axios');
const ipfsnode = `${process.env.REACT_APP_IPFS_PAID_HOST}`;
const sigUtil = require('eth-sig-util')

// TODO: Fix
const ipfs = ipfsClient({ host: ipfsnode, port: '5001', protocol: 'https', apiPath: '/api/v0' });
const apiUrl = `${process.env.REACT_APP_WAKU_SERVER}`;
const recipientTKN = `${process.env.REACT_APP_RECIPIENT_ERC20_TOKEN}`;
const pago = `${process.env.REACT_APP_PAYMENTS_PAID_TOKEN}`;

const createAgreementFormPayload = (obj: any) => {
	const types: string[] = [];
	const values: any[] = [];
	const keys = Object.keys(obj);
	keys.forEach((k) => {
		if (typeof obj[k] === 'string') {
			types.push('string');
			values.push(obj[k]);
		}
		if (typeof obj[k] === 'number') {
			types.push('uint256');
			values.push(obj[k]);
		}
	});
	return ethers.utils.defaultAbiCoder.encode(types, values);
};

const getDocuments = (agreements: any[]) => {
	const payload = {
		from: agreements,
	}
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

const getSelectedSignedDocument = (document: any) => {
	return {
		type: DocumentsActionTypes.COUNTERPARTY_SIGNED_SUCCESS,
		payload: document
	};
};

const getSelectedRejectDocument = (document: any) => {
	return {
		type: DocumentsActionTypes.COUNTERPARTY_REJECT_SIGNED_SUCCESS,
		payload: document
	};
};

export const openSuccessDialog = (message: string) => {
	return {
		type: DialogsActionTypes.OPEN_SUCCESS_DIALOG,
		payload: message
	}
}

export const openErrorDialog = (message: string) => {
	return {
		type: DialogsActionTypes.OPEN_SUCCESS_DIALOG,
		payload: message
	}
}

const getSelectedDocument = (document: any) => {
	return {
		type: DocumentsActionTypes.GET_SELECTED_DOCUMENT_SUCCESS,
		payload: document
	};
};

const setAgreementFormInfo = (formInfo: any) => {
	return {
		type: DocumentsActionTypes.SET_AGREEMENT_FORM_INFO,
		payload: formInfo
	};
};

const createAgreement = () => {
	return {
		type: DocumentsActionTypes.CREATE_AGREEMENT_SUCCESS
	};
};

const getContractInfoByIpfs = async (agreementStoredReference: any) => {
	const firstUrlIpfsContent = `https://ipfs.io/ipfs/${agreementStoredReference}`;
	const firstIpfsContent = async () => {
		return await fetch(firstUrlIpfsContent)
		.then(res => res.text())
	};

	const jsonContent = JSON.parse(await firstIpfsContent());
	const { contentRef } = jsonContent;

	const urlIpfsContent = `https://ipfs.io/ipfs/${contentRef.cid}`;
	const ipfsContent = async () => {
		return await fetch(urlIpfsContent)
		.then(res => res.text())
	};

	const doc = new DOMParser().parseFromString(await ipfsContent(), 'text/html');
	const documentName = doc.querySelector('h1')?.textContent ?? '';
	let partyAName = doc.querySelector('#partyName')?.textContent ?? '';
	let partyBName = doc.querySelector('#counterPartyName')?.textContent ?? '';

	return { documentName, partyAName, partyBName};
}

// declare global {
// 	interface Window { web3: any; ethereum: any; }
// }

export const doCreateAgreement = (payload: {
	signatoryA: string;
	signatoryB: string;
	validUntil: number;
	agreementFormTemplateId: string;
	agreementForm: any;
	template: string;
	slideNext: () => Promise<void>;
	slideBack: () => Promise<void>;
}) => async (dispatch: any, getState: () => { wallet: any }) => {
	dispatch({ type: DocumentsActionTypes.CREATE_AGREEMENT_LOADING });
	try {
		const {
			validUntil,
			agreementFormTemplateId,
			agreementForm,
			template,
			slideNext,
			slideBack
		} = payload;

		const formId = ethers.utils.formatBytes32String(agreementFormTemplateId);
		// form
		const form = createAgreementFormPayload(agreementForm);

		const { wallet } = getState();
		const { selectedToken, currentWallet } = wallet;
		if ((currentWallet == null) || (currentWallet == undefined)) {
			dispatch(openErrorDialog('Not unlocked wallet found'));
			slideBack();
			throw new Error('Not unlocked wallet found');
		}
		const { address, web3, balanceToken, balanceDaiToken, network} = currentWallet;

		if (!web3.utils.isAddress(agreementForm.counterpartyWallet)) {
			dispatch(openErrorDialog('Invalid Counter Party Address'));
			slideBack();
			throw new Error('Invalid Counter Party Address');
		}

		await web3.eth.getBalance(address.toLowerCase()).then((balancewei) =>{
			const balance = web3!.utils.fromWei(balancewei);
			const parsedBalance = BigNumber(balance).toNumber();
			if ((parsedBalance <= 0.0009999999999)) {
				dispatch(openErrorDialog('The wallet should has balance to send a transaction.'));
				slideBack();
				throw new Error('The wallet should has balance to send a transaction.');
			}
		})

		// ALICE SIDE
		// const content = template();
		const content = template;
		const blobContent = base64StringToBlob(btoa(unescape(encodeURIComponent(content))), 'text/html');
		// const arrayContent = btoa(unescape(encodeURIComponent(content)));
		// const bytesContent = ethers.utils.toUtf8Bytes(arrayContent);
		const hashContent:string = web3.utils.sha3(content).replace('0x', '');
		const bytesContent:string = web3.utils.utf8ToHex(hashContent);
		debugger
		const signature:string = await web3.eth.personal.sign(bytesContent, address.toLowerCase());
		debugger
		const digest = ethers.utils.sha256(bytesContent).replace('0x', '');
		// const ec_alice = new eddsa('ed25519');
		// const signer = ec_alice.keyFromSecret(rawWallet.keypairs.ED25519);
		// const signature = signer
		// 	.sign(digest)
		// 	.toHex();
		// const pubKey = signer.getPublic();
		const recover:string = await web3.eth.personal.ecRecover(bytesContent,signature);
		console.log('create document signature, digest', signature, digest, recover, currentWallet?.address);
		debugger;
		const opts = { create: true, parents: true };

		const elementsAbi = abiLib.getElementsAbi({
			"partyAddress":address.toLowerCase()
		});
		const elementsParties = {
			"partyName":agreementForm.name,
			"partyEmail":agreementForm.email,
			"counterpartyName":agreementForm.counterpartyName,
			"counterpartyEmail":agreementForm.counterpartyEmail
		};
		let ipfsHash = await uploadsIPFS(ipfs, blobContent, opts, digest, signature, formId, agreementForm.counterpartyWallet,
			JSON.stringify(elementsAbi), JSON.stringify(elementsParties), null);
		console.log('CID Create Document', ipfsHash.toString());
		// ----------------------------------------------------
		// Verification Network
		if (network != "rinkeby") {
			dispatch(openErrorDialog('You are in a Demo MVP, only Create Smart Agreements in Rinkeby'));
			throw new Error('You are in a Demo MVP, only Create Smart Agreements in Rinkeby')
		}
		// Estimate gas,  TODO encapsulate
		let token:string = '';
		const AgreementContract = ContractFactory.getAgreementContract(web3, network);
		const spender = AgreementContract.options.address;
		AgreementContract.options.from = address;
		// Increase Allowance for withdraw PAID token
		console.log('Pago', pago);
		let metodoTkn:any;
		const paymentSA = web3.utils.toWei(pago, 'ether')
		if (selectedToken === 'paid') {
			if (balanceToken < 1) {
				dispatch(openErrorDialog('You have not enough balance to perform this action'));
				throw new Error('You have not enough balance to perform this action')
			}
			const PaidTokenContract = ContractFactory.getPaidTokenContract(web3, network);
			token = PaidTokenContract.options.address;
			PaidTokenContract.options.from = address;
			console.log('previo pago', paymentSA.toString(),'token address:',  token,'address wallet:', address, 'spender:', spender, 'recipient:', recipientTKN);
			metodoTkn = PaidTokenContract.methods.increaseAllowance(
				spender,
				paymentSA.toString()
			);
		} else if (selectedToken === 'dai') {
			if (balanceDaiToken < 1) {
				dispatch(openErrorDialog('You have not enough balance to perform this action'));
				throw new Error('You have not enough balance to perform this action')
			}
			const DaiTokenContract = ContractFactory.getDaiTokenContract(web3, network);
			token = DaiTokenContract.options.address;
			DaiTokenContract.options.from = address;
			console.log('previo pago', paymentSA.toString(),'token address:',  token,'address wallet:', address, 'spender:', spender, 'recipient:', recipientTKN);
			metodoTkn = DaiTokenContract.methods.approve(
				spender,
				paymentSA.toString()
			);
		} else {
			dispatch(openSuccessDialog('Please Select the Token to use'));
		}
		// estimateGas for Send Tx to IncreaseAllowance
		const gastkn = await metodoTkn.estimateGas();
		// Resolve Promise for Send Tx to IncreaseAllowance
		Promise.resolve(gastkn).then(async (gastkn:any) => {
			const agreementTransaction = await metodoTkn.send({ from: address, gas:gastkn+5e4, gasPrice: 50e9 })
		   .on('receipt', async function (receipt: any) {
				console.log('resolve increaseAllow'+selectedToken+'token',receipt);
				// Withdraw PAID Token
				const metodoFn = AgreementContract.methods.payPaidServices(
					token,
					address,
					recipientTKN,
					paymentSA.toString()
				);
				// EstimateGas for Withdraw PAIDToken
			   	const gastx = await metodoFn.estimateGas();
				// Resolve Promise for Withdraw PAIDToken
			   	Promise.resolve(gastx).then(async (gastx:any) => {
					const withdrawTransaction = await metodoFn.send({ from: address, gas:gastx+5e4, gasPrice: 50e9 })
					.on('receipt', async function (receipt: any) {
						console.log('resolve withdraw'+selectedToken+'token',receipt);
			   			// Create Agreements in the Smart Contract
						const methodFn = AgreementContract.methods.partyCreate(
							validUntil,
							agreementForm.counterpartyWallet,
							ipfsHash.toString(),
							formId,
							form,
							'0x' + digest);
						// estimategas for Create Smart Agreements
						const gas = await methodFn.estimateGas();
						// Resolve Promise for Create Smart Agreements
						Promise.resolve(gas).then(async (gas:any) => {
							const agreementTransaction = await methodFn.send({ from: address, gas:gas+5e4, gasPrice: 50e9 })
							.on('receipt', async function (receipt: any) {
								axios.post(apiUrl+'email/new-agreement', {
									'counterParty': {
										name: agreementForm.counterpartyName,
										email: agreementForm.counterpartyEmail
									},
									'party':{
										'name': agreementForm.name
									}
								})
								.then(function (response) {
									console.log('email response: ', response);
								})
								.catch(function (error) {
									console.log('email error: ',error);
								});
								dispatch(createAgreement());
								dispatch(openSuccessDialog('You have created an agreement successfully'));
								slideNext();
							})
							.on('error', function (error: any, receipt: any) {
								slideBack();
								dispatch(openSuccessDialog('The agreement was not created successfully'));
								// throw new Error('Transaction failed');
							});
						});
					})
					.on('error', function (error: any, receipt: any) {
						console.log(error, receipt);
						dispatch(openSuccessDialog('Failed to Create Smart Agreement'));
						// throw new Error('Transaction failed');
					});
		   		});
		   	})
		   	.on('error', function (error: any, receipt: any) {
			   	console.log(error, receipt);
				   dispatch(openSuccessDialog('Failed to Create Smart Agreement'));
			   	// throw new Error('Transaction failed');
		   	});
		});
	} catch (err) {
		await payload.slideBack();
		alert(err.message);
		console.log('ln284', err);
		dispatch({
			type: DocumentsActionTypes.CREATE_AGREEMENT_FAILURE,
			payload: err.msg
		});
	}
};

export const uploadsIPFS = async (ipfs: any, blobContent: any, opts: any,
	_digest: string, sigArray: any, _docId: any, counterpartyAddress: string,
	elementsAbi: any, elementsParties:any, parent: any = null) => {
	const createCIDHash = (fileEntry: any) => {
		return { path: fileEntry.path, cid: fileEntry.cid.toString() }
	}

	const fileContent = await ipfs.add(blobContent);
	const fileSignature = await ipfs.add(sigArray);
	const _elementsAbi = await ipfs.add(elementsAbi);
	const _elementsParties = await ipfs.add(elementsParties);
	const index = {
		contentRef: createCIDHash(fileContent), sigRef: createCIDHash(fileSignature), digest: _digest,
		parent: parent, docId: _docId, cpartyAddress: counterpartyAddress, elementsAbi: createCIDHash(_elementsAbi),
		elementsParties: createCIDHash(_elementsParties)
	};

	const fileIndex = await ipfs.add(JSON.stringify(index));
	return fileIndex.cid;
}

export const doGetDocuments = (sending_currentWallet: any) => async (
	dispatch: any,
	getState: () => { wallet: any }
) => {
	dispatch({ type: DocumentsActionTypes.GET_DOCUMENTS_LOADING });
	try {
		const { wallet } = getState();
		const { currentWallet } = wallet;
		if ((currentWallet == null) || (sending_currentWallet != currentWallet)){
			throw new Error('Not unlocked wallet found of wallet inconsistences');
		}
		const agreementContract = ContractFactory.getAgreementContract(currentWallet?.web3, currentWallet?.network);
		const eventsSource = await agreementContract.getPastEvents('AgreementEvents', {
			filter: { partySource: currentWallet?.address.toString() },
			fromBlock: 7600000,
			toBlock: 'latest'
		});
		const eventsDestination = await agreementContract.getPastEvents('AgreementEvents', {
			filter: { partyDestination: currentWallet?.address.toString() },
			fromBlock: 7600000,
			toBlock: 'latest'
		});
		const promisesFrom = eventsSource.map(async (event) => {
			const args = event.returnValues;
			const {
				logIndex,
				transactionIndex,
				transactionHash,
				blockHash,
				blockNumber,
				address
			} = event;
			const { id, partySource, partyDestination, formTemplateId, agreementStoredReference } = args;
			const agreementId = (id as BN).toString();

			return new Promise(async (resolve) => {
				const agreement = await agreementContract.methods.agreements(id).call();
				const {
					agreementForm,
					escrowed,
					validUntil,
					toSigner,
					fromSigner,
					status,
					created_at,
					updated_at,
				} = agreement;

				const { documentName, partyAName, partyBName } = await getContractInfoByIpfs(agreementStoredReference);

				resolve({
					meta: {
						logIndex,
						transactionIndex,
						transactionHash,
						blockHash,
						blockNumber,
						address
					},
					event: {
						id: agreementId,
						from: partySource,
						to: partyDestination,
						agreementFormTemplateId: formTemplateId,
						cid: agreementStoredReference,
						status: status,
						created_at: created_at,
						updated_at: updated_at,
					},
					data: {
						documentName,
						partyAName,
						partyBName,
						agreementForm,
						escrowed,
						validUntil: (validUntil as BN).toString(),
						toSigner: toSigner.signatory,
						fromSigner: fromSigner.signatory
					}
				});
			});
		});
		const promisesTo = eventsDestination.map((event) => {
			const args = event.returnValues;
			const {
				logIndex,
				transactionIndex,
				transactionHash,
				blockHash,
				blockNumber,
				address
			} = event;
			const { id, partySource, partyDestination, formTemplateId, agreementStoredReference } = args;
			const agreementId = (id as BN).toString();
			return new Promise(async (resolve) => {
				const agreement = await agreementContract.methods.agreements(id).call();
				const {
					agreementForm,
					escrowed,
					validUntil,
					toSigner,
					fromSigner,
					status,
					created_at,
					updated_at,
				} = agreement;

				const { documentName, partyAName, partyBName } = await getContractInfoByIpfs(agreementStoredReference);

				resolve({
					meta: {
						logIndex,
						transactionIndex,
						transactionHash,
						blockHash,
						blockNumber,
						address
					},
					event: {
						id: agreementId,
						from: partySource,
						to: partyDestination,
						agreementFormTemplateId: formTemplateId,
						cid: agreementStoredReference,
						status: status,
						created_at: created_at,
						updated_at: updated_at,
					},
					data: {
						documentName,
						partyAName,
						partyBName,
						agreementForm,
						escrowed,
						validUntil: (validUntil as BN).toString(),
						toSigner: toSigner.signatory,
						fromSigner: fromSigner.signatory
					}
				});
			});
		});
		const agreementsSource = await Promise.all(promisesFrom);
		const agreementsDestination = await Promise.all(promisesTo);
		let responseArray = new Array<any>();
		let foundIds = new Array<string>();

		for(let i = 0; i < agreementsSource.length; i++){
			let item : any = agreementsSource[i];

			const id = item.event.id;
			let found = false;
			for(let j = i + 1; j < agreementsSource.length; j++){
				let checkItem : any = agreementsSource[j];
				if(checkItem.event.id === id){
					found = true;
					responseArray.push(checkItem);
					foundIds.push(id);
				}
			}
			if(!found){
				let found = false;
				for(let k = 0; k < foundIds.length; k++){
					if(foundIds[k] === id){
						found = true;
						break;
					}
				}
				if(!found){
					responseArray.push(item);
					foundIds.push(id);
				}
			}
		}

		for(let i = 0; i < agreementsDestination.length; i++){
			let item : any = agreementsDestination[i];

			const id = item.event.id;
			let found = false;
			for(let j = i + 1; j < agreementsDestination.length; j++){
				let checkItem : any = agreementsDestination[j];
				if(checkItem.event.id === id){
					found = true;
					responseArray.push(checkItem);
					foundIds.push(id);
				}
			}
			if(!found){
				let found = false;
				for(let k = 0; k < foundIds.length; k++){
					if(foundIds[k] === id){
						found = true;
						break;
					}
				}
				if(!found){
					responseArray.push(item);
					foundIds.push(id);
				}
			}
		}

		console.log('agreementsFrom', agreementsSource, 'agreementsTo', agreementsDestination);
		dispatch(getDocuments(responseArray));
	} catch (err) {
		console.log('ln564', err);
		dispatch({
			type: DocumentsActionTypes.GET_DOCUMENTS_FAILURE,
			payload: err.msg
		});
	}
};

export const doUploadDocuments = (file: any) => async (dispatch: any) => {
	dispatch({ type: DocumentsActionTypes.UPLOAD_DOCUMENTS_LOADING });
	try {
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

export const doSignCounterpartyDocument = (document: any) => async (dispatch: any, getState: () => { wallet: any }) => {
	dispatch({ type: DocumentsActionTypes.COUNTERPARTY_SIGNED_LOADING });
	try {
		let fetchedContent = '';
		if(document){
			const { wallet } = getState();
			const { currentWallet } = wallet;
			if ((currentWallet === null) || (currentWallet === undefined)) {
				dispatch(openSuccessDialog('Not unlocked wallet found'));
				throw new Error('Not unlocked wallet found');
			}
			if (window.ethereum === undefined)  {
				dispatch(openSuccessDialog('Failed to CounterParty Sign Smart Agreement'));
				throw new Error('Failed to CounterParty Sign Smart Agreement');
			}
			await currentWallet?.web3.eth.getBalance(currentWallet?.address).then((balancewei) =>{
				const balance = currentWallet?.web3.utils.fromWei(balancewei);
				const parsedBalance = BigNumber(balance).toNumber();
				if ((parsedBalance <= 0.0009999999999)) {
					throw new Error('The wallet should has balance to send a transaction.');
				}
			})
	
			const AgreementContract = ContractFactory.getAgreementContract(currentWallet?.web3, currentWallet?.network);
			const form = document.data.agreementForm;
			const formId = document.event.agreementFormTemplateId;
			const validUntil = document.data.validUntil;
			const agreementId = document.event.id;
			const cid = document.event.cid.toString();
			console.log('CID Sign counterparty', cid);
	
			for await (const chunk of ipfs.cat(cid)) {
				fetchedContent = uint8ArrayToString(chunk);
			}
			const jsonContent = JSON.parse(fetchedContent);
			const digest = jsonContent.digest;
	
			const contentRef = jsonContent.contentRef;
			// let pdfContent = '';
			// for await (const chunk of ipfs.cat(contentRef.cid)) {
			// 	pdfContent = uint8ArrayToString(chunk);
			// }
			const urlIpfsContent = `https://ipfs.io/ipfs/${contentRef.cid}`;
			const ipfsContent = async () => {
				return await fetch(urlIpfsContent)
				.then(res => res.text())
			}
			const pdfContent:string = await ipfsContent();
			// console.log(pdfContent);
			const blobContent = base64StringToBlob(btoa(unescape(encodeURIComponent(pdfContent))), 'text/html');
			const arrayContent = btoa(unescape(encodeURIComponent(pdfContent)));

			const bytesContent = currentWallet?.web3.utils.utf8ToHex(arrayContent);
			const signature = await currentWallet?.web3.eth.sign(bytesContent, currentWallet?.address.toLowerCase());
			// const ec_alice = new eddsa('ed25519');
			// const signer = ec_alice.keyFromSecret(rawWallet.keypairs.ED25519);
			// const signature = signer
			// 	.sign(digest)
			// 	.toHex();
			// const pubKey = signer.getPublic();
			const opts = { create: true, parents: true };
			const elementsAbi = abiLib.getElementsAbi({
				'address':currentWallet?.address
			});
			const urlParties = `https://ipfs.io/ipfs/${jsonContent.elementsParties.cid}`;
			const partiesContent = async () => {
				return await fetch(urlParties)
				.then(res => res.text())
			}

			const partiesContentStr : string = await partiesContent();

			let ipfsHash = await uploadsIPFS(ipfs, blobContent, opts, digest, signature, formId, currentWallet?.address, JSON.stringify(elementsAbi), partiesContentStr, null);

			const methodFn = AgreementContract.methods.counterPartiesSign(
				agreementId,
				validUntil,
				ipfsHash.toString(),
				formId,
				form,
				'0x' + digest);

			const gas = await methodFn.estimateGas();

			Promise.resolve(gas).then(async (gas:any) => {
				const agreementTransaction = await methodFn.send({ from: currentWallet?.address, gas:gas+5e4, gasPrice: 50e9 })
				.on('receipt', async function (receipt: any) {
					console.log(receipt);
					const parties = JSON.parse(partiesContentStr);
					axios.post(apiUrl+'email/accept-agreement', {
						// counterparty field is the SENDER
						'counterParty': {
							'name': parties.partyName,
							'email': parties.partyEmail
						},
						// party field is the TARGET
						'party':{
							'name': parties.counterpartyName
						}
					})
					.then(function (response) {
						console.log('email response: ', response);
					})
					.catch(function (error) {
						console.log('email error: ',error);
					});
					dispatch(getSelectedSignedDocument(document));
					dispatch(openSuccessDialog('You have successfully sign the Smart Agreement'));
				})
				.on('error', function (error: any, receipt: any) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.		
					// alert('Transaction failed');
					dispatch(openSuccessDialog('Failed Sign the Smart Agreement'));
					dispatch({ type: DocumentsActionTypes.COUNTERPARTY_SIGNED_FAILURE });
					//throw new Error('Transaction failed');
				});
			});
		} else {
			alert('Document Don\'t exist');
			throw new Error('Document Don\'t exist');
		}
	} catch (err) {
		alert(err.message);
		console.log('ln545', err);
		dispatch({
			type: DocumentsActionTypes.COUNTERPARTY_SIGNED_FAILURE,
			payload: err.message
		});
	}

}

export const doRejectCounterpartyDocument = (document: any, comments: string) => async (dispatch: any, getState: () => { wallet: any }) => {
	dispatch({ type: DocumentsActionTypes.COUNTERPARTY_REJECT_SIGNED_LOADING });
	try {
		let fetchedContent = '';
		if(document){
			const { wallet } = getState();
			const { currentWallet } = wallet;
			if ((currentWallet === null) || (currentWallet === undefined)) {
				dispatch(openSuccessDialog('Not unlocked wallet found'));
				throw new Error('Not unlocked wallet found');
			}
			if (window.ethereum === undefined)  {
				dispatch(openSuccessDialog('Failed to CounterParty Reject Smart Agreement'));
				throw new Error('Failed to CounterParty Reject Smart Agreement');
			}

			const form = document.data.agreementForm;
			const formId = document.event.agreementFormTemplateId;
			const validUntil = document.data.validUntil;
			const agreementId = document.event.id;
			const cid = document.event.cid.toString();
			console.log('CID Reject counterparty', cid);

			for await (const chunk of ipfs.cat(cid)) {
				fetchedContent = uint8ArrayToString(chunk);
			}
			const jsonContent = JSON.parse(fetchedContent);
			const digest = jsonContent.digest;

			const contentRef = jsonContent.contentRef;
			// let pdfContent = '';
			// for await (const chunk of ipfs.cat(contentRef.cid)) {
			// 	pdfContent = uint8ArrayToString(chunk);
			// }
			const urlIpfsContent = `https://ipfs.io/ipfs/${contentRef.cid}`;
			const ipfsContent = async () => {
				return await fetch(urlIpfsContent)
				.then(res => res.text())
			}
			const pdfContent:string = await ipfsContent();
			// console.log(pdfContent);
			const blobContent = base64StringToBlob(btoa(unescape(encodeURIComponent(pdfContent))), 'text/html');
			const arrayContent = btoa(unescape(encodeURIComponent(pdfContent)));

			const bytesContent = currentWallet?.web3.utils.utf8ToHex(arrayContent);
			const signature = await currentWallet?.web3.eth.sign(bytesContent, currentWallet?.address.toLowerCase(), 'PAIDNetwork');
			// const ec_alice = new eddsa('ed25519');
			// const signer = ec_alice.keyFromSecret(rawWallet.keypairs.ED25519);
			// const signature = signer
			// 	.sign(digest)
			// 	.toHex();
			// const pubKey = signer.getPublic();
			const opts = { create: true, parents: true };
			const elementsAbi = abiLib.getElementsAbi({
				'address':currentWallet?.address
			});
			const urlParties = `https://ipfs.io/ipfs/${jsonContent.elementsParties.cid}`;
			const partiesContent = async () => {
				return await fetch(urlParties)
				.then(res => res.text())
			}

			const partiesContentStr : string = await partiesContent();

			let ipfsHash = await uploadsIPFS(ipfs, blobContent, opts, digest, signature, formId, currentWallet?.address, JSON.stringify(elementsAbi), partiesContentStr, null);
			console.log('Reject IpfsHash', ipfsHash.ToString())
			// Sending Notification of CounterParty Reject Smart Agreements
			const parties = JSON.parse(partiesContentStr);
			// Sending Notification
			axios.post(apiUrl+'email/reject-agreement', {
				// counterparty field is the SENDER
				'counterParty': {
					'name': parties.counterpartyName,
					'email': parties.counterpartyEmail,
					'comments': comments
				},
				// party field is the TARGET
				'party':{
					'name': parties.partyName
				}
			})
			.then(function (response) {
				console.log('email response: ', response);
			})
			.catch(function (error) {
				console.log('email error: ',error);
				dispatch(openSuccessDialog('Error Sending Reject Notification'));
			});
			dispatch(getSelectedRejectDocument(document));
			dispatch(openSuccessDialog('You Reject the Smart Agreement'));
		}
	} catch (err) {
		// alert(err.message);
		console.log('ln545', err);
		dispatch(openSuccessDialog('Failed Reject Notification'));
		dispatch({
			type: DocumentsActionTypes.COUNTERPARTY_REJECT_SIGNED_FAILURE,
			payload: err.msg
		});
	}

}

export const doGetSelectedDocument = (document: any) => async (dispatch: any, getState: () => { wallet: any }) => {
	dispatch({ type: DocumentsActionTypes.GET_SELECTED_DOCUMENT_LOADING });
	let fetchedContent = '';
	if (document) {
		const { wallet } = getState();
		const { currentWallet } = wallet;
		if ((currentWallet === null) || (currentWallet === undefined)) {
			dispatch(openSuccessDialog('Not unlocked wallet found'));
			throw new Error('Not unlocked wallet found');
		}
		if (window.ethereum === undefined)  {
			dispatch(openSuccessDialog('Failed to CounterParty Reject Smart Agreement'));
			throw new Error('Failed to CounterParty Reject Smart Agreement');
		}
		console.log('CID Get Selected Document', document.event.cid.toString())
		for await (const chunk of ipfs.cat(document.event.cid.toString())) {
			fetchedContent = uint8ArrayToString(chunk);
		}
		const jsonContent = JSON.parse(fetchedContent);

		let signatureContent = '';

		for await (const chunk of ipfs.cat(jsonContent.sigRef.cid)) {
			signatureContent = uint8ArrayToString(chunk);
		}

		document.signature = signatureContent.substr(0, 20) + '...' +
			signatureContent.substr(signatureContent.length - 20);

		// verify signature

		const sigRef = jsonContent.sigRef;
		const contentRef = jsonContent.contentRef;
		let signature = '';
		for await (const chunk of ipfs.cat(sigRef.cid)) {
			signature = uint8ArrayToString(chunk);
		}
		let ContentDoc = ''
		for await (const chunk of ipfs.cat(contentRef.cid)) {
			ContentDoc = uint8ArrayToString(chunk);
		}
		console.log('sign and content:', signature, ContentDoc)
		document.verified = true;
	}
	dispatch(getSelectedDocument(document));
};

export const doSetAgreementFormInfo = (formInfo: any) => async (
	dispatch: any
) => {
	try {
		dispatch(setAgreementFormInfo(formInfo));
	} catch (err) {
		console.log(err);
	}
};

export const doSetKeepMyInfo = (agreementFormInfo: any) => (dispatch: any) => {
	dispatch({ type: DocumentsActionTypes.SET_KEEP_MY_INFO });
	try {
		if (agreementFormInfo != null) {
			const { email, confirmEmail, name, address, phone } = agreementFormInfo;
			const myInfoString = JSON.stringify({
				email,
				confirmEmail,
				name,
				address,
				phone
			});
			Storage.set({ key: STORAGE_KEY_MY_INFO_KEPT, value: myInfoString });
		} else {
			Storage.remove({ key: STORAGE_KEY_MY_INFO_KEPT });
		}
		dispatch({ type: DocumentsActionTypes.SET_KEEP_MY_INFO_SUCCESS, payload: agreementFormInfo != null });
	} catch (err) {
		dispatch(openErrorDialog(err.message));
		dispatch({ type: DocumentsActionTypes.SET_KEEP_MY_INFO_FAILURE });
	}
};

export const doLoadMyInfoKept = () => async (dispatch: any) => {
	dispatch({ type: DocumentsActionTypes.SET_KEEP_MY_INFO });
	try {
		const myInfoString = await Storage.get({ key: STORAGE_KEY_MY_INFO_KEPT });
		const formInfo = (myInfoString.value != null) ?
		(JSON.parse(myInfoString.value)) : 
		({
			email: '',
			confirmEmail: '',
			name: '',
			address: '',
			phone: '',
			counterpartyEmail: '',
			counterpartyConfirmEmail: '',
			counterpartyWallet: '',
			counterpartyName: '',
			counterpartyAddress: '',
			counterpartyPhone: '',
			createdAt: null
		});

		dispatch(setAgreementFormInfo(formInfo));
		dispatch({ type: DocumentsActionTypes.SET_KEEP_MY_INFO_SUCCESS, payload: myInfoString.value != null });
	} catch (err) {
		dispatch(openErrorDialog(err.message));
		dispatch({ type: DocumentsActionTypes.SET_KEEP_MY_INFO_FAILURE });
	}
};
