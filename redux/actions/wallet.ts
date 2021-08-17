import { NextRouter } from 'next/router';

import WalletActionTypes from '../actionTypes/wallet';

const doConnectToWallet = (provider: string) => (dispatch: any) => {
  dispatch({
    type: WalletActionTypes.CONNECTING_WALLET,
    payload: { provider },
  });
};

export const setCurrentWallet = (currentWallet: string, router: NextRouter, query: any) => (
  dispatch: any,
) => {
  dispatch({
    type: WalletActionTypes.SET_CURRENT_WALLET,
    payload: { currentWallet },
  });
  if (query && query.agreement) {
    router.push('/agreements');
    return;
  }
  router.push('/profile');
};

export const doDisconnect = () => (
  dispatch: any,
) => {
  dispatch({
    type: WalletActionTypes.SET_DISCONECTING,
  });
};

export const doDisconnected = () => (
  dispatch: any,
) => {
  dispatch({
    type: WalletActionTypes.SET_DISCONECTED,
  });
};

export default doConnectToWallet;
