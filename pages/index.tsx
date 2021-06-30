import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button } from 'reactstrap';
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
    if (currentWallet) {
      setOpenConnectSelector(false);
    }
  }, [currentWallet]);

  return (
    <>
      <Head>
        <title>Paid-Dapp</title>
        <link rel="icon" href="/assets/icon/.ico" />
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
