import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { Card } from 'reactstrap';
import { Wallet } from 'xdv-universal-wallet-core';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import KeyResolver from 'key-did-resolver';
import { DID } from 'dids';
import { arrayify, mnemonicToSeed } from 'ethers/lib/utils';
import elliptic_1 from 'elliptic';
import { toEthereumAddress } from 'did-jwt';
import ProfileStateModel from '../models/profileStateModel';
import FormProfile from '../components/profile/FormProfile';
import ProfileModel from '../models/profileModel';
import doSetProfile from '../redux/actions/profile';

const Profile: FC = () => {
  const dispatch = useDispatch();
  const profileState: ProfileStateModel = useSelector(
    (state: any) => state.profileReducer,
  );

  const currentWallet = useSelector(
    (state: { walletReducer: any }) => state.walletReducer.currentWallet,
  );

  const [profile, setProfile] = useState<ProfileModel>(profileState.profile);

  const create3ID = async (wallet) => {
    let seed = arrayify(mnemonicToSeed(wallet.mnemonic));
    seed = seed.slice(0, 32);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: KeyResolver.getResolver() });
    await did.authenticate();
    return did;
  };

  const { name } = profile;
  const emptyProfile = !name;

  const onSubmit = async (values: ProfileModel) => {
    try {
      const getCurrentWallet = global.localStorage.getItem(currentWallet);
      const profileData = JSON.parse(getCurrentWallet);
      const accountName = `${values.name.toLocaleLowerCase()}${values.lastName.toLocaleLowerCase()}`;

      const xdvWallet = new Wallet({ isWeb: true });

      await xdvWallet.open(accountName, values.passphrase);

      await xdvWallet.enrollAccount({
        passphrase: values.passphrase,
        accountName,
      });

      const acct = await xdvWallet.getAccount() as any;
      const walletId = await xdvWallet.addWallet();
      const keystore = acct.keystores.find((el) => el.walletId === walletId);

      const walletDid = await create3ID(keystore);
      const kp = new elliptic_1.eddsa('ed25519');
      const kpInstance = kp.keyFromSecret(keystore.keypairs.ED25519);
      const walletAddress = toEthereumAddress(kpInstance.getPublic('hex'));

      const walletStorage = {
        ...profile,
        ...values,
        walletId,
        profileName: accountName,
        created: profileData.createdAt,
      };
      global.localStorage.setItem(currentWallet, JSON.stringify(walletStorage));
      const currentProfile = {
        ...profile,
        ...values,
        did: walletDid,
        walletAddress,
        created: profileData.createdAt,
      };
      dispatch(doSetProfile(currentProfile));
      setProfile(currentProfile);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Head>
        <title>PAID - Profile</title>
        <link rel="icon" href="/assets/icon/.ico" />
      </Head>
      <div className="profile m-0 p-0 px-4 container-fluid">
        <div className="row m-0 p-0 h-100">
          <div className="col-12 py-4">
            <h3>
              My Profile
              {/* : {currentWallet} */}
            </h3>
          </div>
          <div className="col-12">
            <Card className="border-0">
              <div className="form-wrapper">
                <FormProfile
                  profile={profile}
                  emptyProfile={emptyProfile}
                  onSubmit={onSubmit}
                />
                {/* <Button onClick={() => onDisconnect()}>Disconnect</Button> */}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
