import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { current } from '@reduxjs/toolkit';
import { copy } from 'ionicons/icons';
import React, { FC, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doShowMyCurrentWallet } from '../redux/actions/wallet';
import { TOAST_DURATION_WALLET_ADDRESS_COPY } from '../utils/constants';

const MyCurrentWallet: FC = () => {
    const dispatch = useDispatch();
    const walletState = useSelector(
        (state: { wallet: {
            openCurrentWallet: boolean; currentWallet: any
        } }) => state.wallet
    );

    const spanRef = useRef<HTMLSpanElement | null>(null);
    const [showToastCopy, setShowToastCopy] = useState(false);

    const { openCurrentWallet, currentWallet } = walletState;
    // if (currentWallet == null) {
    //     throw new Error('No connect Wallet, MyCurrrent Wallet Modal');
    // }
    // const { balance, balanceToken, balanceDaiToken } = currentWallet;

    const dismiss = () => dispatch(doShowMyCurrentWallet(false));

    const copyAddressToClipboard = () => {
		const textArea: HTMLTextAreaElement = document.createElement("textarea");
		textArea.value = spanRef.current?.textContent ?? '';
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("Copy");
		textArea.remove();
		setShowToastCopy(true);
	};

    return (
        <IonModal
            isOpen={openCurrentWallet}
            backdropDismiss
            cssClass="unlock-modal"
            onDidDismiss={() => dismiss()}
        >
            <IonHeader translucent={false} mode="md">
                <IonToolbar>
                    <IonTitle>My Current Wallet</IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            color="secondary"
                            shape="round"
                            onClick={() => dismiss()}
                        >
                            Close
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonItem>
                        <IonLabel
                            color="primary"
                            position="stacked"
                            className="principal-label"
                        >
                            Name:
                        </IonLabel>
                        <span>My Wallet</span>
                    </IonItem>
                    <IonItem>
                        <IonLabel
                            color="primary"
                            position="stacked"
                            className="principal-label"
                        >
                            Address BNB:
                        </IonLabel>
                        <div>
                            <span ref={spanRef} hidden>{currentWallet?.address}</span>
                            <a href={`https://${currentWallet?.network == 'testnet' ? currentWallet?.network+'.' : ''}bscscan.com/address/${currentWallet?.address}`} target="_blank">{currentWallet?.address}</a>
                            <IonIcon icon={copy} onClick={() => copyAddressToClipboard()} className="copy-icon" />
                        </div>
                    </IonItem>
                    <IonItem>
                        <IonLabel
                            color="primary"
                            position="stacked"
                            className="principal-label"
                        >
                            Address PAID Token:
                        </IonLabel>
                        <div>
                            <span ref={spanRef} hidden>{currentWallet?.address_eth}</span>
                            <a href={`https://${currentWallet?.network_eth == 'rinkeby' ? currentWallet?.network_eth+'.' : ''}etherscan.io/address/${currentWallet?.address_eth}`} target="_blank">{currentWallet?.address_eth}</a>
                            <IonIcon icon={copy} onClick={() => copyAddressToClipboard()} className="copy-icon" />
                        </div>
                    </IonItem>
                    <IonItem>
                        <IonLabel
                            color="primary"
                            position="stacked"
                            className="principal-label"
                        >
                            Balances
                        </IonLabel>
                    </IonItem>
                    <IonItem className="balance-content">
                        <IonLabel>{currentWallet?.balanceToken}</IonLabel>
                        <IonImg
                            src="/assets/icon/icon.png"
                            slot="start"
                            className="balance-coin-icon"
                        />
                    </IonItem>
                    <IonItem className="balance-content">
                        <IonLabel>{currentWallet?.balanceEth}</IonLabel>
                        <IonImg
                            src="/assets/icon/ethereumlogo.svg"
                            slot="start"
                            className="balance-coin-icon"
                        />
                    </IonItem>
                    <IonItem className="balance-content">
                        <IonLabel>{currentWallet?.balance}</IonLabel>
                        <IonImg
                            src="/assets/icon/bnblogo.svg"
                            slot="start"
                            className="balance-coin-icon"
                        />
                    </IonItem>
                    {/* <IonItem className="balance-content">
                        <IonLabel>{currentWallet?.balanceDaiToken}</IonLabel>
                        <IonImg
                            src="/assets/icon/dailogo.svg"
                            slot="start"
                            className="balance-coin-icon"
                        />
                    </IonItem> */}
                </IonList>
                <IonToast
					isOpen={showToastCopy}
					color="primary"
					onDidDismiss={() => setShowToastCopy(false)}
					message="Wallet address has been copied to clipboard"
					duration={TOAST_DURATION_WALLET_ADDRESS_COPY}
				/>
            </IonContent>
        </IonModal>
    );
}

export default MyCurrentWallet;