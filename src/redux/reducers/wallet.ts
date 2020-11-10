import { WalletActionTypes } from '../actionTypes/wallet';

const initialState = {
	loadingWallets: false,
	creatingWallet: false,
	importingWallet: false,
	exportingWallet: false,
	confirmed: null,
	permanentSeedPhrase: [],
	seedPhrase: [],
	confirmedSeedPhrase: [],
	wallets: [],
	currentWallet: null,
	selectedWallet: null,
	settingCurrentWallet: false,
	gettingCurrentWallet: false,
	unlockingWallet: false,
	unlockedWallet: null
};

export const WalletReducer = function (state = initialState, action: any) {
	const { type, payload } = action;
	switch (type) {
		case WalletActionTypes.GENERATE_PHRASE:
			return {
				...state,
				seedPhrase: payload,
				permanentSeedPhrase: payload,
				confirmedSeedPhrase: []
			};

		case WalletActionTypes.ADD_WORD: {
			let confirmedPhrase = state.confirmedSeedPhrase.slice();
			let seedPhrase = state.seedPhrase.slice();
			const index = state.confirmedSeedPhrase.length;
			// @ts-ignore
			confirmedPhrase.splice(index, 0, payload.word);
			seedPhrase.splice(payload.index, 1);
			for (let i = 0; i < state.permanentSeedPhrase.length; i += 1) {
				if (state.permanentSeedPhrase[i] === confirmedPhrase[i]) {
					if (i === 11) {
						return {
							...state,
							seedPhrase: seedPhrase,
							confirmedSeedPhrase: confirmedPhrase,
							confirmed: true
						};
					}
				}
			}
			return {
				...state,
				seedPhrase: seedPhrase,
				confirmedSeedPhrase: confirmedPhrase,
				confirmed: false
			};
		}

		case WalletActionTypes.REMOVE_WORD: {
			let confirmedPhrase = state.confirmedSeedPhrase.slice();
			let seedPhrase = state.seedPhrase.slice();
			const index = state.seedPhrase.length;

			confirmedPhrase.splice(payload.index, 1);
			// @ts-ignore
			seedPhrase.splice(index, 0, payload.word);

			return {
				...state,
				seedPhrase: seedPhrase,
				confirmedSeedPhrase: confirmedPhrase,
				confirmed: false
			};
		}
		case WalletActionTypes.GET_WALLETS_LOADING:
			return { ...state, loadingWallets: true };

		case WalletActionTypes.GET_WALLETS_SUCCESS:
			return { ...state, wallets: payload, loadingWallets: false };

		case WalletActionTypes.GET_WALLETS_FAILURE:
			return { ...state, wallets: [], error: payload, loadingWallets: false };

		case WalletActionTypes.CREATE_WALLET_LOADING:
			return { ...state, creatingWallet: true };

		case WalletActionTypes.CREATE_WALLET_SUCCESS:
			return {
				...state,
				wallets: [...state.wallets, payload],
				currentWallet: payload,
				creatingWallet: false
			};

		case WalletActionTypes.CREATE_WALLET_FAILURE:
			return { ...state, user: [], error: payload, creatingWallet: false };

		case WalletActionTypes.IMPORT_WALLET_LOADING:
			return { ...state, importingWallet: true };

		case WalletActionTypes.IMPORT_WALLET_SUCCESS:
			return {
				...state,
				wallets: [...state.wallets, payload],
				importingWallet: false,
				seedPhrase: [],
				permanentSeedPhrase: [],
				confirmedSeedPhrase: []
			};

		case WalletActionTypes.IMPORT_WALLET_FAILURE:
			return { ...state, user: [], error: payload, importingWallet: false };

		case WalletActionTypes.EXPORT_WALLET_LOADING:
			return { ...state, exportingWallet: true };

		case WalletActionTypes.EXPORT_WALLET_SUCCESS:
			return { ...state, wallets: payload, exportingWallet: false };

		case WalletActionTypes.EXPORT_WALLET_FAILURE:
			return { ...state, user: [], error: payload, exportingWallet: false };

		case WalletActionTypes.SET_CURRENT_WALLET_LOADING:
			return { ...state, settingCurrentWallet: true };

		case WalletActionTypes.SET_CURRENT_WALLET_SUCCESS:
			return {
				...state,
				currentWallet: payload,
				unlockedWallet: null,
				settingCurrentWallet: false
			};

		case WalletActionTypes.SET_CURRENT_WALLET_FAILURE:
			return { ...state, error: payload, gettingCurrentWallet: false };

		case WalletActionTypes.GET_CURRENT_WALLET_LOADING:
			return { ...state, settingCurrentWallet: true };

		case WalletActionTypes.GET_CURRENT_WALLET_SUCCESS:
			return { ...state, currentWallet: payload, gettingCurrentWallet: false };

		case WalletActionTypes.GET_CURRENT_WALLET_FAILURE:
			return { ...state, error: payload, gettingCurrentWallet: false };

		case WalletActionTypes.UNLOCK_WALLET_LOADING:
			return { ...state, unlockingWallet: true };

		case WalletActionTypes.UNLOCK_WALLET_SUCCESS:
			return {
				...state,
				unlockedWallet: payload,
				unlockingWallet: false,
				error: null,
				seedPhrase: [],
				permanentSeedPhrase: [],
				confirmedSeedPhrase: []
			};

		case WalletActionTypes.UNLOCK_WALLET_FAILURE:
			return { ...state, error: payload, unlockingWallet: false };

		case WalletActionTypes.SET_SELECTED_WALLET_SUCCESS:
			return { ...state, selectedWallet: payload, error: null };
		default:
			return state;
	}
};
