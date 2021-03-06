import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button } from 'reactstrap';
import TagManager from 'react-gtm-module';
import { useDispatch, useSelector } from 'react-redux';
import WalletSelectorModal from '@/components/connect/WalletSelectorModal';
import doConnectToWallet from '../redux/actions/wallet';

const Index: React.FC = () => {
  const dispatch = useDispatch();
  const [openConnectSelector, setOpenConnectSelector] = useState(false);

  const onConnect = async (provider) => {
    dispatch(doConnectToWallet(provider));
  };

  const onOpenConnectSelector = () => {
    setOpenConnectSelector(true);
  };

  const currentWallet = useSelector(
    (state: { walletReducer: any }) => state?.walletReducer.currentWallet,
  );

  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-5KG4364' });
  }, []);

  useEffect(() => {
    if (currentWallet) {
      setOpenConnectSelector(false);
    }
  }, [currentWallet]);

  return (
    <>
      <Head>
        <title>Paid-Dapp</title>
        <link rel="icon" href="/assets/icon/.ico" />
        <link
          href="https://fontlibrary.org//face/open-sauce-one"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto"
          rel="stylesheet"
        />
        <noscript>
          <iframe
            title="googletagmanager"
            src="https://www.googletagmanager.com/ns.html?id=GTM-5KG4364"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </Head>

      <div className="index m-0 p-0 container-fluid">
        <div className="row h-100  justify-content-center align-items-center">
          <div className="col-12 text-center">
            <img
              className="logo d-block mx-auto pb-4"
              src="/assets/images/logo.svg"
              alt=""
            />
            <Button color="danger" onClick={() => onOpenConnectSelector()}>
              Connect to Wallet
            </Button>
            <p className="info mt-4">
              By continuing you agree to our
              {' '}
              <span className="text-danger">T&#38;Cs</span>
              . We use your data to
              offer you a personalized experience.
              {' '}
              <span className="text-danger">Find out more</span>
              .
            </p>
          </div>
        </div>
        <WalletSelectorModal
          open={openConnectSelector}
          onConnect={onConnect}
        />
      </div>
    </>
  );
};

export default Index;
