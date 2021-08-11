import { Wallet } from 'xdv-universal-wallet-core'
import ProfileModel from '../models/profileModel'

const getDidXdv = async (currentWallet: string) => {
  let walletId
  const profileData = JSON.parse(currentWallet) as ProfileModel
  const { profileName, passphrase, name } = profileData

  const xdvWallet = new Wallet({ isWeb: true })
  await xdvWallet.open(profileName, passphrase)
  const acct = await xdvWallet.getAccount()

  if (acct.get('keystores').length === 0) {
    // Adds a wallet.
    walletId = await xdvWallet.addWallet()
  } else {
    // Gets first wallet
    walletId = acct.get('keystores')[0].walletId
  }

  const provider = await xdvWallet.createEd25519({
    passphrase,
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    walletId,
    registry: '',
    accountName: name,
  })

  const xdvAuthenticate = await provider.did.authenticate()
  xdvWallet.close()
  return {
    profileData,
    acct,
    provider,
    xdvAuthenticate,
  }
}

export default getDidXdv
