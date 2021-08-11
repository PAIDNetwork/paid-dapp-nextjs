interface ProfileModel extends WalletExtend {
  name?: string
  lastName?: string
  passphrase?: string
  did?: any
  created?: string
  confirmPassphrase?: string
  email?: string
  address?: string
}

interface WalletExtend {
  profileName?: string
  walletId?: string
}

export default ProfileModel
