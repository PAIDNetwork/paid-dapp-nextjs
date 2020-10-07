// @ts-ignore
import { combineReducers } from '@reduxjs/toolkit';
// @ts-ignore
import { WalletReducer } from './wallet';
import { AuthReducer } from './auth';

// @ts-ignore
const rootReducer = combineReducers({
    wallet: WalletReducer,
    auth: AuthReducer
});

// @ts-ignore
export type RootState = ReturnType<typeof rootReducer>;
// @ts-ignore
export default rootReducer;
