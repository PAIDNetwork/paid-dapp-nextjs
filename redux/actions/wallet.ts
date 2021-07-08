import { NextRouter } from 'next/router';

import WalletActionTypes from '../actionTypes/wallet';

const doConnectToWallet = (provider: string) => (dispatch: any) => {
  dispatch({
    type: WalletActionTypes.CONNECTING_WALLET,
    payload: { provider },
  });
  // const currentWallet = "0x3442C44B4Bbf87144Ad0e4a2C60e4bE801d30FA8";
  // const currentProfile = retrieveDID();
  // const { firstName, lastName, email } = currentProfile;

  // if (!(firstName && lastName && email)) {
  //   dispatch({
  //     type: WalletActionTypes.SET_CURRENT_WALLET,
  //     payload: currentWallet,
  //   });
  //   router.push("/profile");
  // } else {
  //   dispatch({
  //     type: ProfileActionTypes.SET_PROFILE_DATA,
  //     payload: currentProfile,
  //   });
  //   dispatch({
  //     type: WalletActionTypes.SET_CURRENT_WALLET,
  //     payload: currentWallet,
  //   });
  //   router.push("/agreements");
  // }
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
