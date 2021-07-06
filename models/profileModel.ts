interface ProfileModel {
  name?: string;
  lastName?: string;
  passphrase?: string;
  did?: any;
  created?: string;
  dateBirth?: string;
  confirmPassphrase?: string;
  email?: string;
  address?: string;
  phone?: string;
  walletAddress?: string;
}

export default ProfileModel;
