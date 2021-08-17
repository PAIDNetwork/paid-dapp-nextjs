import { combineReducers } from 'redux';
import profileReducer from './profile';
import menuReducer from './menu';
import agreementReducer from './agreement';
import walletReducer from './wallet';
import smartAgreementsReducer from './smartAgreements';
import wakuReducer from './waku';

const reducers: any = {
  profileReducer,
  menuReducer,
  agreementReducer,
  smartAgreementsReducer,
  wakuReducer,
  walletReducer,
};

export default combineReducers(reducers);
