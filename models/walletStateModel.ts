interface WalletStateModel {
  currentWallet: string | null;
  loading: boolean;
  provider: string
  openProvider: boolean,
  isDisconnecting: false
}

export default WalletStateModel;
