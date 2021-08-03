import { Wallet } from 'xdv-universal-wallet-core'
import ProfileModel from '../models/profileModel'

const getDidXdv = async (currentWallet: string) => {
  let walletId
  const profileData = JSON.parse(currentWallet) as ProfileModel
  const { profileName, passphrase, name } = profileData

  const xdvWallet = new Wallet({ isWeb: true })
  await xdvWallet.open(profileName, passphrase)

  const acct = await xdvWallet.getAccount()

  if (acct.keystores.length === 0) {
    // Adds a wallet.
    console.log('YES / acct.keystores.length')
    walletId = await xdvWallet.addWallet()
  } else {
    // Gets first wallet
    console.log('NO / acct.keystores.length')
    walletId = acct.keystores[0].walletId
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
