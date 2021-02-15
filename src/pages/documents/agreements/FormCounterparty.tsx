import {
	IonLabel,
	IonItem,
	IonInput,
	IonButton,
	IonLoading,
	IonNote
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	doSetAgreementFormInfo
} from '../../../redux/actions/documents';

interface AgreementFormProps {
	current: any;
}

const FormCounterparty: React.FC<AgreementFormProps> = ({ current }) => {
	const dispatch = useDispatch();
	const [filled, setFilled] = useState(false);
	const [validEmail, setValidEmail] = useState(true);
	const [validConfirmEmail, setValidConfirmEmail] = useState(true);
	const [validName, setValidName] = useState(true);
	const [validAddress, setValidAddress] = useState(true);
	const [validPhone, setValidPhone] = useState(true);
	const [validCounterpartyWallet, setValidCounterpartyWallet] = useState(true);
	const [sameCurrentWallet, setSameCurrentWallet] = useState(false);
	const [startValidation, setStartValidation] = useState(false);

	const documentsState = useSelector((state: any) => state.documents);
	const wallet = useSelector(
		(state: { wallet: { currentWallet: any } }) => state.wallet
	);
	const { currentWallet } = wallet;

	

	const {
		loading,
		agreementFormInfo,
		creatingAgreement
	} = documentsState;

	useEffect(() => {
		verifyInfo();
	}, [agreementFormInfo]);

	function emailChanged(e: any) {
		setStartValidation(true);
		dispatch(doSetAgreementFormInfo({counterpartyEmail: e.target.value}));
	}

	function confirmEmailChanged(e: any) {
		setStartValidation(true);
		dispatch(doSetAgreementFormInfo({counterpartyConfirmEmail: e.target.value}));
	}

	function nameChanged(e: any) {
		setStartValidation(true);
		dispatch(doSetAgreementFormInfo({ counterpartyName: e.target.value }));
	}

	function addressChanged(e: any) {
		setStartValidation(true);
		dispatch(doSetAgreementFormInfo({ counterpartyAddress: e.target.value }));
	}

	function phoneChanged(e: any) {
		setStartValidation(true);
		dispatch(doSetAgreementFormInfo({ counterpartyPhone: e.target.value }));
	}

	function walletChanged(e: any) {
		setStartValidation(true);
		dispatch(doSetAgreementFormInfo({ counterpartyWallet: e.target.value }));
	}

	function verifyInfo() {
		const {
			counterpartyEmail,
			counterpartyConfirmEmail,
			counterpartyWallet, 
			counterpartyName, 
			counterpartyAddress, 
			counterpartyPhone 
		}  = agreementFormInfo;
		setFilled(
			/.+@.+\..+/.test(counterpartyEmail) &&
			currentWallet?.address.toLowerCase() !== counterpartyWallet.toLowerCase() &&
			counterpartyEmail.toLowerCase()  === counterpartyConfirmEmail.toLowerCase()  &&
			counterpartyWallet.length > 3 &&
			counterpartyName.length > 3 &&
			counterpartyAddress.length > 3 &&
			counterpartyPhone.length > 3
		);

		if (startValidation) {
			setValidEmail(/.+@.+\..+/.test(counterpartyEmail));
			setValidConfirmEmail(counterpartyEmail.toLowerCase() === counterpartyConfirmEmail.toLowerCase());
			setValidName(counterpartyName.length > 3);
			setValidAddress(counterpartyAddress.length > 3);
			setValidPhone(counterpartyPhone.length > 3);
			setValidCounterpartyWallet(counterpartyWallet.length > 3);
			setSameCurrentWallet(currentWallet?.address.toLowerCase() === counterpartyWallet.toLowerCase());
		}
	}

	async function slideNext() {
		await current.lockSwipeToNext(false);
		await current.updateAutoHeight();
		await current.slideNext();
		await current.lockSwipeToNext(true);
	}

	async function slideBack() {
		await current.lockSwipeToPrev(false);
		await current.updateAutoHeight();
		await current.slidePrev();
		await current.lockSwipeToPrev(true);
	}

	return (
		<div className="agreement-content">
			<h5 className="agreement-form-title">
				Counterparty Information
			</h5>
			<form action="" className="name-password-form">
				<IonItem>
					<IonLabel position="stacked">Full Name</IonLabel>
					<IonInput
						title="Label"
						type="text"
						placeholder="Enter a name"
						onInput={
							(e) => {
								nameChanged(e);
							}
						}
						onIonBlur={
							(e) => {
								nameChanged(e);
							}
						}
					/>
					{
						!validName &&
						<IonNote color="danger" className="ion-margin-top">
							Full name must be at least 3 characters.
						</IonNote>
					}
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Email</IonLabel>
					<IonInput
						title="Label"
						type="text"
						placeholder="Enter an email"
						onInput={(e) => {
							emailChanged(e);
						}}
						onIonBlur={(e) => {
							emailChanged(e);
						}}
					/>
					{
						!validEmail &&
						<IonNote color="danger" className="ion-margin-top">
							You must enter a valid email.
						</IonNote>
					}
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Confirm Email</IonLabel>
					<IonInput
						title="Label"
						type="text"
						placeholder="Confirm email"
						onInput={(e) => {
							confirmEmailChanged(e);
						}}
						onIonBlur={(e) => {
							confirmEmailChanged(e);
						}}
					/>
					{
						!validConfirmEmail &&
						<IonNote color="danger" className="ion-margin-top">
							Email and confirm email do not match.
						</IonNote>
					}
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Address</IonLabel>
					<IonInput
						title="Label"
						type="text"
						placeholder="Enter an address"
						onInput={
							(e) => {
								addressChanged(e);
							}
						}
						onIonBlur={
							(e) => {
								addressChanged(e);
							}
						}
					/>
					{
						!validAddress &&
						<IonNote color="danger" className="ion-margin-top">
							Address must be at least 3 characters.
						</IonNote>
					}
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Phone</IonLabel>
					<IonInput
						title="Label"
						type="tel"
						placeholder="Enter a phone number"
						onInput={
							(e) => {
								phoneChanged(e);
							}
						}
						onIonBlur={
							(e) => {
								phoneChanged(e);
							}
						}
					/>
					{
						!validPhone &&
						<IonNote color="danger" className="ion-margin-top">
							Phone must be at least 3 numbers.
						</IonNote>
					}
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Destination Wallet Address</IonLabel>
					<IonInput
						title="Label"
						placeholder="Enter the destination wallet address"
						onInput={
							(e) => {
								walletChanged(e);
							}
						}
						onIonBlur={
							(e) => {
								walletChanged(e);
							}
						}
					/>
					{
						!validCounterpartyWallet &&
						<IonNote color="danger" className="ion-margin-top">
							You must enter a destination wallet address
						</IonNote>
					}
					{
						sameCurrentWallet &&
						<IonNote color="danger" className="ion-margin-top">
							Destination wallet address is matching with your current wallet
						</IonNote>
					}
				</IonItem>
				<IonItem class="form-options">
					<IonButton
						color="danger"
						shape="round"
						onClick= { () => slideBack() }
					>
					 Back
					</IonButton>
					<IonButton
						// routerLink="/phrase/instructions"
						onClick={() => {
							slideNext();
						}}
						color="gradient"
						shape="round"
						disabled={!filled}
					>
						{loading ? 'Loading..' : 'Confirm'}
					</IonButton>
				</IonItem>
			</form>
			<IonLoading
				cssClass="loader-spinner"
				mode="md"
				isOpen={creatingAgreement}
			/>
		</div>
	);
};

export default FormCounterparty;
