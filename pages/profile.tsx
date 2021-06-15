import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { Card } from 'reactstrap';
import { Wallet } from 'xdv-universal-wallet-core';
import ProfileStateModel from '../models/profileStateModel';
import FormProfile from '../components/profile/FormProfile';
import PassphraseModal from '../components/profile/PassphraseModal';
import ProfileModel from '../models/profileModel';
import doSetProfile from '../redux/actions/profile';
import { Ed25519Provider } from "key-did-provider-ed25519";  
import KeyResolver from 'key-did-resolver';
import { DID } from 'dids'
import { arrayify, mnemonicToSeed } from "ethers/lib/utils";
const elliptic_1 = require("elliptic");
const did_jwt_1 = require("did-jwt");

const Profile: FC = () => {
  const dispatch = useDispatch();
  const profileState: ProfileStateModel = useSelector(
    (state: any) => state.profileReducer,
  );

  const currentWallet = useSelector(
    (state: { walletReducer: any }) => state.walletReducer.currentWallet,
  );

  const [profile, setProfile] = useState<ProfileModel>(profileState.profile);
  const [openPassphraseModal, setOpenPassphraseModal] = useState(false);
  const [passphrase, setPassphrase] = useState(null);
  const [errorPassphrase, setErrorPassphrase] = useState(false);

  useEffect(() => {
    const getCurrentWallet = global.sessionStorage.getItem(currentWallet);
    if (!profile.name && getCurrentWallet) {
      setOpenPassphraseModal(true);
    }
  }, []);

  const create3ID = async (wallet) => {
    let seed = arrayify(mnemonicToSeed(wallet.mnemonic));
    seed = seed.slice(0, 32);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: KeyResolver.getResolver() });
    await did.authenticate();
    return did;
  }

  useEffect(() => {
    const bootstrapAsync = async () => {
      const getCurrentWallet = global.sessionStorage.getItem(currentWallet);
      if (!profile.name && getCurrentWallet) {
        if (passphrase) {
          try {
            const profileData = JSON.parse(getCurrentWallet);
            console.log(profileData);
            const name = profileData.profileName;
            const accountName = profileData.profileName.replace(/' '/g,'').toLowerCase();
            const xdvWallet = new Wallet({ isWeb: true });
            await xdvWallet.open(accountName, passphrase);
            await xdvWallet.enrollAccount({
              passphrase,
              accountName,
            });
            const acct = await xdvWallet.getAccount();
            var keystore = acct.keystores.find((el)=> el.walletId === profileData.walletId);
            const walletDid = await create3ID(keystore);

            const kp = new elliptic_1.eddsa('ed25519');        
            const kpInstance = kp.keyFromSecret(keystore.keypairs.ED25519);
            const walletAddress = did_jwt_1.toEthereumAddress(kpInstance.getPublic('hex'));
            
            /*const walletDid = await xdvWallet.createES256K({
              rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
              walletId: profileData.walletId,
              registry: '',
              accountName: profileData.accountName,
            });*/

            const currentProfile = {
              name,
              created: profileData.createdAt,
              did: walletDid,
              address: walletAddress
            };
            setErrorPassphrase(false);
            setPassphrase(null);
            setOpenPassphraseModal(false);
            dispatch(doSetProfile(currentProfile));
            setProfile(currentProfile);
          } catch (e) {
            setErrorPassphrase(true);
          }
        }
      }
    };

    bootstrapAsync();
  },
  [passphrase]);

  const { name } = profile;
  const emptyProfile = !name;

  const onSubmit = async (values: ProfileModel) => {
    const created = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).format(new Date());
    try {
      
      const accountName = values.name.replace(/' '/g,'').toLowerCase();
      const xdvWallet = new Wallet({ isWeb: true });
      

      await xdvWallet.open(accountName, values.passphrase);
      
      
      await xdvWallet.enrollAccount({
        passphrase: values.passphrase,
        accountName,
      });
      console.log(xdvWallet);
      const acct = await xdvWallet.getAccount();
      const walletId = await xdvWallet.addWallet();
      var keystore = acct.keystores.find((el)=> el.walletId === walletId);
      
      const walletDid = await create3ID(keystore);
      const kp = new elliptic_1.eddsa('ed25519');        
      const kpInstance = kp.keyFromSecret(keystore.keypairs.ED25519);
      const walletAddress = did_jwt_1.toEthereumAddress(kpInstance.getPublic('hex'));
      
      /*const walletDid = await xdvWallet.createES256K({
        passphrase: values.passphrase,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
        walletId,
        registry: '',
        accountName: values.name,
      });*/

      const walletSessionStorage = { walletId, profileName: values.name, createdAt: created };
      global.sessionStorage.setItem(currentWallet, JSON.stringify(walletSessionStorage));
      const currentProfile = {
        ...values,
        created,
        did: walletDid,
        address: walletAddress,
      };

      dispatch(doSetProfile(currentProfile));
      setProfile(currentProfile);
      
    } catch (e) {
      console.error(e);
    }
  };

  // const onDisconnect = () => {
  //   dispatch(doDisconnect());
  // };

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
      <PassphraseModal
        open={openPassphraseModal}
        errorPassphrase={errorPassphrase}
        setPassphrase={setPassphrase}
      />
    </>
  );
};

export default Profile;
