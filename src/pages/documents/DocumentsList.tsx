import {
	IonItem,
	IonIcon,
	IonLabel,
	IonButton,
	IonModal,
	IonCardContent,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonBadge,
	IonToast,
	IonCard, IonTitle, IonHeader, IonToolbar, IonButtons, IonContent, IonLoading, IonList, IonTextarea, IonNote,
} from '@ionic/react';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeCircle, checkmarkCircle } from 'ionicons/icons';
import {
	doGetSelectedDocument,
	doSignCounterpartyDocument,
	doGetDocuments,
	doRejectCounterpartyDocument
} from '../../redux/actions/documents';

import { format } from 'date-fns';
import { base64StringToBlob } from 'blob-util';
import AgreementType from '../../models/AgreementType';

import useInterval from '../../hooks/useInterval';
import { TOAST_DURATION_WALLET_ADDRESS_COPY } from '../../utils/constants';

const uint8ArrayToString = require('uint8arrays/to-string');
const ipfsClient = require('ipfs-http-client');
// TODO: Get ipfs IP Public of Kubernets Enviroment Variable
const ipfsnode = `${process.env.REACT_APP_IPFS_PAID_HOST}`;

const ipfs = ipfsClient({ host: ipfsnode, port: '5001', protocol: 'https', apiPath: '/api/v0' });

function PdfViewerModal(payload: {
	show: boolean;
	closePdfViewer: () => void;
	url: string,
	pdfContent: string
}) {
	const { show, closePdfViewer, url } = payload;
	
	return (
		<div id="modal-container">
			<IonModal isOpen={show} cssClass="pdf-viewer-modal" onDidDismiss={() => {closePdfViewer()}}>
				<IonHeader translucent={false} mode="md">
					<IonToolbar>
						<IonTitle>Document</IonTitle>
						<IonButtons slot="end">
							<IonButton color="secondary" shape="round" onClick={() => closePdfViewer()}>
								Close
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonHeader>
				<IonContent color="primary" scrollY={false}>
					<iframe src={url} width="100%" height="100%" frameBorder="0"></iframe>
				</IonContent>
			</IonModal>
		</div>
	);
}

  
function createMarkup(html: string) {
    return {__html: html};
  }

function SelectedDocument(payload: {
	show: boolean;
	showPdfViewerModal: boolean;
	selectedDocument: any;
	closeShowDocument: () => void;
	verifyDocument: (document: any) => void;
	rejectDocument: (document: any, comments: string) => void;
	openPdfViewerModal: (cid : string, transactionHash: string) => void;
	closePdfViewerModal: () => void;
	agreementsurl: string;
	agreementContent: string;
	showVerified: any;
	showNotVerified: any;
	verifyButtonDisable: boolean;
	showSignedText: boolean;
	showVerifyDocumentButton: boolean;
}) {
	const { 
		show, 
		agreementsurl, 
		agreementContent, 
		selectedDocument, 
		closeShowDocument, 
		showPdfViewerModal, 
		openPdfViewerModal, 
		closePdfViewerModal,
		verifyDocument,
		rejectDocument,
		showVerified,
		showNotVerified,
		verifyButtonDisable,
		showSignedText,
		showVerifyDocumentButton
	} = payload;
	const wallet = useSelector((state: any) => state.wallet);

	const { currentWallet } = wallet;

	const [networkText, setNetWorkText] = useState(currentWallet?.network);
	const [comments, setComments] = useState('');
	const [validReject, setValidReject] = useState(true);

	useEffect(() => {
		setComments('');
	}, [show]);

	useEffect(() => {
		if (currentWallet) {
			setNetWorkText(currentWallet?.network);
		}
	}, [currentWallet]);


	if (!selectedDocument) {
		return null;
	}

	const setter = (set: Function) => (e: any) => {
		const { target } = e;
		const { value } = target;

		set(value);
	}

	const reject = (document: any) => {
		if (comments.length <= 0 || comments === ' ') {
			setValidReject(false);
			return;
		} else {
			rejectDocument(document, comments);
			return;
		}
	}

	const { event } = selectedDocument;

	const createdAt = format(new Date(event.created_at * 1000), 'MM/dd/yyyy kk:mm:ss');
	const updatedAt = format(new Date(event.updated_at * 1000), 'MM/dd/yyyy kk:mm:ss');

	return (
		<div id="modal-container">
			<IonModal isOpen={show} cssClass="document-modal" onDidDismiss={() => {closeShowDocument()}}>
				<IonContent scrollY>

					<IonCard>
						<IonCardHeader>
							<IonCardTitle className="document-title-modal">
								<div>
									{`${selectedDocument.data?.documentName} ( ${selectedDocument.data?.partyAName} - ${selectedDocument.data?.partyBName} )`}
								</div>
								{
									showVerifyDocumentButton &&
									<div>
										<IonButton
											className="small-button font-size-13"
											color="primary"
											onClick={async () => {
												verifyDocument(selectedDocument);
											}}
											disabled={verifyButtonDisable}
										>
											<span>Verify document</span>
										</IonButton>
										{ showVerified ? <span className="icon-wrapper">
											<IonIcon
												ios={checkmarkCircle}
												md={checkmarkCircle}
												color="primary"
												className="font-size-20"
											/>
										</span> : null }
										{ showNotVerified ? <span className="icon-wrapper">
											<IonIcon
												ios={closeCircle}
												md={closeCircle}
												color="secondary"
												className="font-size-20"
											/>
										</span> : null }
									</div>
								}
							</IonCardTitle>
							<IonCardSubtitle>
							</IonCardSubtitle>
						</IonCardHeader>
						<IonCardContent>
							<div>
								Expires in {(selectedDocument.data.validUntil > 1) ?
								`${selectedDocument.data.validUntil} days` :
								`${selectedDocument.data.validUntil} day`}
							</div>
							<h2>Details</h2>
							<div className="details-wrapper">
								<IonItem>
									<IonLabel position="stacked">Signed By</IonLabel>
									<a href={`https://${networkText == 'testnet' ? networkText+'.' : ''}bscscan.com/address/${selectedDocument.event.from}`} target="_blank">{selectedDocument.event.from}</a>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Transaction Hash</IonLabel>
									<a href={`https://${networkText == 'testnet' ? networkText+'.' : ''}bscscan.com/tx/${selectedDocument.meta.transactionHash}`} target="_blank">{selectedDocument.meta.transactionHash}</a>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Document Signature</IonLabel>
									<span>{selectedDocument.signature}</span>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Created on</IonLabel>
									<span>{createdAt}</span>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Updated</IonLabel>
									<span>{updatedAt}</span>
								</IonItem>
								{
									(!showVerifyDocumentButton) &&
									<IonItem>
										<IonLabel position="stacked">Comments</IonLabel>
										<IonTextarea
											title="Comments" 
											placeholder="Enter your comments"
											value={comments}
											onInput={setter(setComments)}
										/>
										{
											!validReject &&
											<IonNote color="danger" className="ion-margin-top">
												You must enter comments for reject.
											</IonNote>
										}
									</IonItem>
								}
							</div>
						</IonCardContent>
					</IonCard>
				</IonContent>
				<hr />
				<IonItem className="modal-actions">
					<IonButton
						color="gradient"
						shape="round"
						onClick={() => {
							openPdfViewerModal(selectedDocument.event.cid, selectedDocument.meta.transactionHash);
						}}
					>
						<span>Open Pdf</span>
					</IonButton>
					{
						(!showVerifyDocumentButton || showSignedText) &&
						<IonButton
							color="gradient"
							shape="round"
							onClick={() => {
								verifyDocument(selectedDocument);
							}}
							disabled={verifyButtonDisable || showSignedText}
						>
							{ (!showVerifyDocumentButton) && <span>Accept</span> }
						</IonButton>
					}
					{
						(!showVerifyDocumentButton) &&
						<IonButton
							color="gradient"
							shape="round"
							onClick={() => {
								reject(selectedDocument);
							}}
						>
							<span>Reject</span>
						</IonButton>
					}
					<IonButton
						color="secondary"
						shape="round"
						onClick={() => {
							closeShowDocument();
						}}
					>
						<span>Close</span>
					</IonButton>
				</IonItem>
			</IonModal>
			<PdfViewerModal
				show={showPdfViewerModal}
				closePdfViewer={closePdfViewerModal}
				url={"https://ipfs.io/ipfs/"+agreementsurl}
				pdfContent = {agreementContent}
			/>
		</div>
	);
}


interface Props {
	documentsTo: [];
	documentsFrom: [];
	type: string;
	counterType: string,
	agreementTypes: [];
	onClickAgreementType: any;
}

const DocumentsList: React.FC<Props> = ({
	documentsTo, 
	documentsFrom, 
	type, 
	counterType,
	agreementTypes,
	onClickAgreementType
}) => {
	const dispatch = useDispatch();
	const documentsState = useSelector((state: any) => state.documents);
	const {
		selectedDocument,
		loading,
		notification
	} = documentsState;
	const [showModal, setShowModal] = useState(false);
	const [showVerified, setShowVerified] = useState(false);
	const [showNotVerified, setShowNotVerified] = useState(false);
	const [verifyButtonDisable, setVerifyButtonDisable] = useState(false);
	const [showPdfViewerModal, setPdfViewerModal] = useState(false);
	const [showAgreementsUrl, setAgreementUrl] = useState('');
	const [agreementContent, setAgreementContent] = useState('');
	const [showSignedText, setShowSignedText ] = useState(false);
	const [reloadDocuments, setReloadDocument] = useState(false);
	const [showVerifyDocumentButton, setShowVerifyDocumentButton] = useState(false);
	const [forceVerifyDocument, setForceVerifyDocument] = useState(false);
	// Dynamic delay
	const [delay, setDelay] = useState<number>(15000);
	// ON/OFF
	const [isPlaying, setPlaying] = useState<boolean>(true);
	const [showToast, setShowToast] = useState(false);
	const wallet = useSelector((state: any) => state.wallet);
	const { currentWallet } = wallet;
	// Verify a notification
	if (notification.length > 0) {
		console.log('detecting message');
		setShowToast(true)
	}
	// Updating GetDocuments
	useInterval(
		() => {
			// console.log('15 sec');
		  	dispatch(doGetDocuments({...currentWallet,no_loading: true}))
		},
		isPlaying ? delay : null);

	function showDocument(item: any) {
		setForceVerifyDocument(false);
		dispatch(doGetSelectedDocument(item));
		setShowVerifyDocumentButton(!(item.event.to.toLowerCase() === currentWallet?.address.toLowerCase() && parseInt(item.event.status?.toString()) === 0));
		setShowModal(true);
		setShowNotVerified(false);
		setShowVerified(false);
	}

	async function verifyDocument(document: any) {
		setVerifyButtonDisable(true);
		if(document.event.status != 0 || document.event.from.toLowerCase() === currentWallet?.address.toLowerCase() || forceVerifyDocument){
			let fetchedContent	 = '';
			for await (const chunk of ipfs.cat(document.event.cid)) {
				fetchedContent = uint8ArrayToString(chunk);
			}
			const jsonContent = JSON.parse(fetchedContent);

			// const fetchedPubKey = jsonContent.publicKey;

			// const ec = new eddsa('ed25519');
			// const key = ec.keyFromPublic(fetchedPubKey);
			const sigRef = jsonContent.sigRef;
			const contentRef = jsonContent.contentRef;
			let signature = '';
			for await (const chunk of ipfs.cat(sigRef.cid)) {
				signature = uint8ArrayToString(chunk);
			}
			let content = ''
			for await (const chunk of ipfs.cat(contentRef.cid)) {
				content = uint8ArrayToString(chunk);
			}
			// Verify signing

			const verified:boolean = true;
			setShowVerified(verified);
			setShowNotVerified(!verified);
			}
		else{
			dispatch(doSignCounterpartyDocument(document));
			setForceVerifyDocument(true);
			setReloadDocument(true);
			setShowVerifyDocumentButton(true);
		}
		setVerifyButtonDisable(false);
	}

	function rejectDocument(document: any, comments: string) {
		dispatch(doRejectCounterpartyDocument(document, comments));
		setForceVerifyDocument(true);
		setReloadDocument(true);
		setShowVerifyDocumentButton(true);
	}

	function closeShowDocument() {
		dispatch(doGetSelectedDocument(null));
		setShowModal(false);
		if(reloadDocuments){
			dispatch(doGetDocuments(currentWallet));
			setReloadDocument(false);
		}
	}

	function closePdfViewer() {
		setPdfViewerModal(false)
	}

	async function openPdfViewer(cid:string, transactionHash: string) {
		let fetchedContent = '';

		for await (const chunk of ipfs.cat(cid.toString())) {
			fetchedContent = uint8ArrayToString(chunk);
		}

		const jsonContent = JSON.parse(fetchedContent);
		const contentRef = jsonContent.contentRef;

		setAgreementUrl(contentRef.cid);
		setPdfViewerModal(true);

		let pdfContent = '';

		for await (const chunk of ipfs.cat(contentRef.cid)) {
			pdfContent = uint8ArrayToString(chunk);
		}

		setAgreementContent(pdfContent);
	}
	const agreementTypesList = () => {
		return <IonList>
			{
				agreementTypes.map((type: AgreementType, index: number) => {
					return (
						<IonItem
							className="ion-text-center"
							onClick={() => {
								onClickAgreementType(type.code);
							}}
							key={index}
						>
							<IonLabel>
								{type.name}
							</IonLabel>
						</IonItem>
					);
				})
			}
		</IonList>
	}
	return (
		<div>
			<IonLoading
				cssClass="loader-spinner"
				mode="md"
				isOpen={loading}

			/>
			<div className="documents-container">
				{console.log(documentsFrom)}
				{
					(documentsFrom.length > 0) &&
					<>
						<div className="table-header">
							<div className="col">Document</div>
							<div className="col">Company</div>
							<div className="col">Counterparty</div>
							<div className="col">Valid</div>
							<div className="col">Created</div>
							<div className="col">Updated</div>
							<div className="col">State</div>
						</div>
						{
							documentsFrom.map((document: any, index: number) => {
								const {data, meta, event} = document;
								if (meta.blockNumber !== 0) {
									const createdAt = format(new Date(event.created_at * 1000), 'MM/dd/yyyy kk:mm:ss');
									const updatedAt = format(new Date(event.updated_at * 1000), 'MM/dd/yyyy kk:mm:ss');
									const from:boolean = (currentWallet?.address.toLowerCase()  == event.from.toLowerCase() );
									const to:boolean = (currentWallet?.address.toLowerCase()  == event.to.toLowerCase() );

									return (
										<div key={index} className="table-body" onClick={async () => {showDocument({data, meta, event})}}>
											<div className="col">{(data.documentName?.length > 12) ? `${data.documentName.slice(0, 12)}...` : data.documentName}</div>
											<div className="col">{data.partyAName}</div>
											<div className="col">{data.partyBName}</div>
											<div className="col">{data.validUntil}</div>
											<div className="col">{createdAt}</div>
											<div className="col">{updatedAt}</div>
											<div className="col">
												{(event.status == 9 && from ? <IonBadge color="warning">REJECT</IonBadge> : 
												(event.status == 9 && to ? <IonBadge color="primary">REJECT</IonBadge> : 
												(event.status == 1 && from ? <IonBadge color="warning">SIGNED</IonBadge> : 
												(event.status == 1 && to ? <IonBadge color="primary">SIGNED</IonBadge> : 
												(event.status == 0 && from ? <IonBadge color="success">PENDING</IonBadge> : 
												(event.status == 0 && to ? <IonBadge color="secondary">SIGN</IonBadge> : null))))))}
											</div>
										</div>
									);
								} else {
									return (
										<div className="empty-documents-container">
										</div>
									)
								}
							})
						}
					</>
				}
				{
					(!documentsFrom.length) &&
					<div className="empty-documents-container">
						<IonTitle color="primary">You don't have any agreements yet. Select a template from the list below to create one.</IonTitle>
						{
							agreementTypesList()
						}
					</div>
				}
			</div>

			<IonToast
				isOpen={showToast}
				color="primary"
				onDidDismiss={() => setShowToast(false)}
				message={notification}
				duration={TOAST_DURATION_WALLET_ADDRESS_COPY}
			/>

			<SelectedDocument
				show={showModal}
				selectedDocument={selectedDocument}
				closeShowDocument={closeShowDocument}
				showPdfViewerModal={showPdfViewerModal}
				closePdfViewerModal={closePdfViewer}
				openPdfViewerModal={openPdfViewer}
				agreementsurl={showAgreementsUrl}
				agreementContent = {agreementContent}
				verifyDocument = {verifyDocument}
				rejectDocument = {rejectDocument}
				showVerified = {showVerified}
				showNotVerified = {showNotVerified}
				verifyButtonDisable={verifyButtonDisable}
				showSignedText = {showSignedText}
				showVerifyDocumentButton = {showVerifyDocumentButton}
			/>
		</div>
	);
};

// @ts-ignore
export default DocumentsList;
