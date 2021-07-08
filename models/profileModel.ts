interface ProfileModel {
  name?: string;
  lastName?: string;
  passphrase?: string;
  did?: any;
  created?: string;
  confirmPassphrase?: string;
  email?: string;
  address?: string;
  walletAddress?: string;
}

export default ProfileModel;
