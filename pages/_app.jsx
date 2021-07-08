import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { WalletProvider, useWallet } from 'react-binance-wallet';
import { Wallet } from 'xdv-universal-wallet-core';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { DID } from 'dids';
import { arrayify, mnemonicToSeed } from 'ethers/lib/utils';
import KeyResolver from 'key-did-resolver';
import elliptic_1 from 'elliptic';
import { toEthereumAddress } from 'did-jwt';

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

    const create3ID = async (wallet) => {
      let seed = arrayify(mnemonicToSeed(wallet.mnemonic));
      seed = seed.slice(0, 32);
      const provider = new Ed25519Provider(seed);
      const did = new DID({ provider, resolver: KeyResolver.getResolver() });
      await did.authenticate();
      return did;
    };

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
              await xdvWallet.enrollAccount({
                passphrase,
                accountName,
              });
              const acct = await xdvWallet.getAccount();
              const keystore = acct.keystores.find((el) => el.walletId === profileData.walletId);

              const walletDid = await create3ID(keystore);

              const kp = new elliptic_1.eddsa('ed25519');
              const kpInstance = kp.keyFromSecret(keystore.keypairs.ED25519);
              const walletAddress = toEthereumAddress(kpInstance.getPublic('hex'));

              const currentProfile = {
                ...profileData,
                created: profileData.createdAt,
                did: walletDid,
                walletAddress,
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
