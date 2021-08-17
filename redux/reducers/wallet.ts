import ActionModel from '../../models/actionModel';
import WalletStateModel from '../../models/walletStateModel';
import WalletActionTypes from '../actionTypes/wallet';

const initialState: WalletStateModel = {
  currentWallet: null,
  loading: false,
  provider: null,
  openProvider: false,
  isDisconnecting: false,
};

const walletReducer = (
  state: WalletStateModel = initialState,
  action: ActionModel,
) => {
  const { type, payload } = action;
  switch (type) {
    case WalletActionTypes.CONNECTING_WALLET: {
      return {
        ...state,
        provider: payload.provider,
        openProvider: true,
        loading: true,
        isDisconnecting: false,
      };
    }
    case WalletActionTypes.SET_CURRENT_WALLET: {
      return {
        ...state,
        currentWallet: payload.currentWallet,
        loading: false,
        openProvider: false,
        isDisconnecting: false,
      };
    }

    case WalletActionTypes.SET_DISCONECTING: {
      return {
        ...state,
        isDisconnecting: true,
        provider: null,
        currentWallet: null,
        openProvider: false,
      };
    }
    case WalletActionTypes.SET_DISCONECTED: {
      return {
        ...state,
        isDisconnecting: false,
        provider: null,
        currentWallet: null,
        openProvider: false,
      };
    }
    default:
      return { ...state };
  }
};

export default walletReducer;
