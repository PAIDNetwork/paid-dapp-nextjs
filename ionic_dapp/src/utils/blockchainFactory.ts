// import {  createWalletManager, WalletManager, AlgorithmType, KeyModel} from 'universal-crypto-wallet';
// import { KeyStorageModel } from 'universal-crypto-wallet/dist/key-storage/KeyStorageModel';
// import { WalletModel } from 'universal-crypto-wallet/dist/key-storage/WalletModel';
import Web3 from 'web3';
import { WebsocketProvider } from 'web3-providers-ws';

export interface WalletModel {
    web3Instance: Web3;
    walletInstance: any;
    network: number;
}

export class BlockchainFactory {
	
	private static wssUrl = `${process.env.REACT_APP_WEB3_WSS}`;
	private static WssUrl = 'wss://bsc-ws-node.nariox.org:443';
	private static _web3: Web3 | null = null;
	private static _web3wss: WebsocketProvider  | null = null;
	// private static _walletManager: WalletManager | null = null;
	// private static _keystore: KeyStorageModel;
	private static _wallet1: WalletModel | null = null;
	private static _wallet2: WalletModel | null = null;

	private static options = {
		timeout: 30000,
		clientConfig: {
			// Useful if requests are large
			maxReceivedFrameSize: 10000000,   // bytes - default: 1MiB
			maxReceivedMessageSize: 80000000, // bytes - default: 8MiB

			// Useful to keep a connection alive
			keepalive: true,
			keepaliveInterval: 60000 // ms
		},
		// Enable auto reconnection
		reconnect: {
			auto: true,
			delay: 2500, // ms
			maxAttempts: 5,
			onTimeout: false
		}
	};

	// public static getWeb3Instance = async (walletAddress: string, walletId: string, password: string) => {
	// 	if(!BlockchainFactory._wallet || (BlockchainFactory._wallet.walletInstance.address !== walletAddress)){
	// 		BlockchainFactory._wallet = await BlockchainFactory._walletManager?.createBlockchainWallet(BlockchainFactory.wssUrl, BlockchainFactory.options, 
	// 			walletId, password) as any;
	// 	}
	// 	return BlockchainFactory._wallet;
	// };

	public static getWeb3Mask = async (ethereum: any) => {
		if(!BlockchainFactory._wallet1) {
				const _web3 = new Web3 (ethereum);
				const wallet:WalletModel = {
					web3Instance: _web3,
					walletInstance: _web3.eth.accounts.wallet,
					network: await _web3.eth.getChainId()
				}
				BlockchainFactory._wallet1 = wallet;
		}
		return BlockchainFactory._wallet1;
	}

	public static getWeb3Binance = async (ethereum: any) => {
		if(!BlockchainFactory._wallet2) {
				const _web3 = new Web3 (ethereum);
				const wallet:WalletModel = {
					web3Instance: _web3,
					walletInstance: _web3.eth.accounts.wallet,
					network: await _web3.eth.getChainId()
				}
				BlockchainFactory._wallet2 = wallet;
		}
		return BlockchainFactory._wallet2;
	}

	public static getWeb3WSS = async (ethereum: any) => {
		if(!BlockchainFactory._wallet1) {
				const _web3 = new Web3 (ethereum);
				_web3.setProvider(new Web3.providers.WebsocketProvider(BlockchainFactory.WssUrl));
				const wallet:WalletModel = {
					web3Instance: _web3,
					walletInstance: _web3.eth.accounts.wallet,
					network: await _web3.eth.getChainId()
				}
				BlockchainFactory._wallet1 = wallet;
		}
		return BlockchainFactory._wallet1;
	}

	// public static getWalletManager = () => {
	// 	if (!BlockchainFactory._walletManager) {
	// 		BlockchainFactory._walletManager = createWalletManager();
	// 	}

	// 	return BlockchainFactory._walletManager;
	// };


	// public static setKeystore(keystore: KeyStorageModel): void {
	// 	BlockchainFactory._keystore = keystore;
	// }


	public static getNetwork = async (network:number | string) => {
		switch (network) {
			case 1 : {
				return "mainnet";
			}
			case 3 : {
				return "ropsten";
			}
			case 4 : {
				return "rinkeby";
			}
			case 42 : {
				return "kovan";
			}
			case 56 : {
				return "bsc-mainnet";
			}
			case 97 : {
				return "testnet";
			}
			case 'Binance-Chain-Tigris' : {
				return "bbc-mainnet"
			}
			case 'Binance-Chain-Ganges' : {
				return "bbc-testnet"
			}
			default: {
				return "Not Admit this Network"
			}
		}
	}


}