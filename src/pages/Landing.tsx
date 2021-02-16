import {
	IonButton,
	IonContent,
	IonImg,
	IonLoading,
	IonPage,
	IonRouterLink
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import BannerMessage from '../components/BannerMessage';
import Terms from '../components/Terms';
import useTimeout from '../hooks/useTimeout';
import { doConnectWallet } from '../redux/actions/wallet';

declare global {
	interface Window { web3: any; BinanceChain: any;}
}

const Landing: React.FC = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const wallet = useSelector(
		(state: { wallet: { connectedWallet: boolean ; currentWallet: any } }) =>
			state.wallet
	);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [showBannerWallet, setShowBannerWallet] = useState(false);
	const { connectedWallet, currentWallet } = wallet;

	useTimeout(() => {
		if (window.BinanceChain === undefined) {
			setShowBannerWallet(true);
		}
	}, 700);
	
	return (
		<IonPage>
			<BannerMessage isOnlyMobile message="Only Desktop experience is currently available. Mobile app will be coming soon." />
			{
				(showBannerWallet) &&
				<BannerMessage
					isOnlyDesktop
					message={
						<p>
							Welcome to PAID Network Running On Binance Smart Chain (BSC)
							<br />
							<a href="https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp" target="_blank">Click here</a> to see the link to install your Binance Chain Wallet.
						</p>
					}
				/>
			}
			<IonContent fullscreen class="landing-content">
				<div className="landing-logo">
					<IonImg src="/assets/images/logo-full.png" />
				</div>

				{/* <IonLoading
					cssClass="loader-spinner"
					mode="md"
					isOpen={loading}
				/> */}
						<IonButton
						onClick={() => {
							dispatch(doConnectWallet(window.BinanceChain, history));
						}}
						className="enableEthereumButton"
						color="primary"
						shape="round"
						>
							Connect to Binance Chain Wallet
						</IonButton>
				<div className="terms">
					By continuing you agree to our <IonRouterLink onClick={() => setShowTermsModal(true)}>T&Cs.</IonRouterLink>
					We use your data to offer you a personalized experience.
					<IonRouterLink onClick={() => setShowTermsModal(true)}>Find out more.</IonRouterLink>
					<Terms show={showTermsModal} dismiss={() => {setShowTermsModal(false)}} />
				</div>
			</IonContent>
		</IonPage>
	);
};

// @ts-ignore
export default Landing;
