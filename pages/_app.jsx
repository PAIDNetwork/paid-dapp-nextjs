import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { WalletProvider, useWallet } from 'react-binance-wallet';
import { Wallet } from 'xdv-universal-wallet-core';

import PassphraseModal from '@/components/profile/PassphraseModal';
import AccountModal from '@/components/account-modal/AccountModal';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import doSetProfile from '../redux/actions/profile';
import { setCurrentWallet, doDisconnected } from '../redux/actions/wallet';
import { useStore } from '../redux/store';
import '../sass/styles.scss';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  // eslint-disable-next-line react/prop-types
  const store = useStore(pageProps.initialReduxState);

  const ConnectOptions = () => {
    const { account, connect, reset } = useWallet();
    const [openAccountModal, setOpenAccountModal] = useState(false);
    const [passphrase, setPassphrase] = useState(null);
    const [openPassphraseModal, setOpenPassphraseModal] = useState(false);
    const [errorPassphrase, setErrorPassphrase] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { query } = useRouter();

    const walletReducer = useSelector((state) => state.walletReducer);

    useEffect(() => {
      const bootstrapAsync = async () => {
        const getCurrentWallet = global.localStorage.getItem(account);
        if (getCurrentWallet) {
          if (passphrase) {
            try {
              const profileData = JSON.parse(getCurrentWallet);
              const accountName = profileData.profileName;
              const xdvWallet = new Wallet({ isWeb: true });
              await xdvWallet.open(accountName, passphrase);

              const walletId = await xdvWallet.addWallet();
              const walletDid = await xdvWallet.createEd25519({
                passphrase: profileData.passphrase,
                rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
                walletId,
                registry: '',
                accountName: profileData.name,
              });
              xdvWallet.close();
              const currentProfile = {
                ...profileData,
                created: profileData.created,
                did: walletDid,
                walletAddress: walletDid.address,
              };
              setErrorPassphrase(false);
              setPassphrase(null);
              setOpenPassphraseModal(false);
              dispatch(doSetProfile(currentProfile));
              dispatch(setCurrentWallet(account, router, query));
            } catch (e) {
              setErrorPassphrase(true);
            }
          }
        }
      };

      bootstrapAsync();
    }, [passphrase]);

    useEffect(() => {
      if (walletReducer.provider) {
        if (walletReducer.provider === 'meta') {
          connect('injected');
        } else {
          connect(walletReducer.provider);
        }
      }
    }, [walletReducer.provider]);

    useEffect(() => {
      if (!walletReducer.currentWallet && account && !walletReducer.isDisconnecting) {
        const getCurrentWallet = global.localStorage.getItem(account);
        if (getCurrentWallet) {
          setOpenPassphraseModal(true);
        } else {
          setOpenAccountModal(true);
        }
      }
    }, [account, !walletReducer.currentWallet]);

    useEffect(() => {
      if (walletReducer.isDisconnecting) {
        reset();
        dispatch(doDisconnected());
        router.push('/');
      }
    }, [account, walletReducer.isDisconnecting]);

    return (
      <>
        {router.pathname === '/' ? (
          <Component {...pageProps} />
        ) : (
          <PrivateLayout routerName={router.pathname}>
            <Component {...pageProps} />
            <style global jsx>
              {`
              html,
              body,
              body > div:first-child,
              div#__next,
              div#__next > div {
                height: 100%;
              }
            `}
            </style>
          </PrivateLayout>
        )}
        <AccountModal open={openAccountModal} />
        <PassphraseModal
          open={openPassphraseModal}
          errorPassphrase={errorPassphrase}
          setPassphrase={setPassphrase}
        />
      </>
    );
  };

  return (
    <Provider store={store}>
      <WalletProvider chainIds={[1, 4, 56, 97]}>
        <ConnectOptions />
      </WalletProvider>
    </Provider>
  );
}

export default MyApp;
