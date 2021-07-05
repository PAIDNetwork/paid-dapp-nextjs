import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PdModal, PdModalBody } from '@/pdComponents';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'react-binance-wallet';
import { Wallet } from 'xdv-universal-wallet-core';
import { arrayify, mnemonicToSeed } from 'ethers/lib/utils';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { DID } from 'dids';
import KeyResolver from 'key-did-resolver';
import elliptic_1 from 'elliptic';
import { toEthereumAddress } from 'did-jwt';

import ProfileModel from '@/models/profileModel';
import ProfileStateModel from '@/models/profileStateModel';
import { setCurrentWallet } from '../../redux/actions/wallet';
import doSetProfile from '../../redux/actions/profile';
import helper from '../../utils/helper';
import FormAccountStepOne from './FormAccountStepOne';
import FormAccountStepTwo from './FormAccountStepTwo';

interface AccountModalProps {
  open: boolean;
}

const AccountModal: FC<AccountModalProps> = ({
  open,
}: AccountModalProps) => {
  const dispatch = useDispatch();
  const profileState: ProfileStateModel = useSelector(
    (state: any) => state.profileReducer,
  );
  const { account } = useWallet();
  const [profile, setProfile] = useState<ProfileModel>(profileState.profile);
  const [step, setStpe] = useState(0);
  const router = useRouter();
  const { formatDateProfile } = helper;

  const create3ID = async (wallet) => {
    let seed = arrayify(mnemonicToSeed(wallet.mnemonic));
    seed = seed.slice(0, 32);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: KeyResolver.getResolver() });
    await did.authenticate();
    return did;
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      if (profile.passphrase && step === 2) {
        const created = formatDateProfile(new Date());
        const accountName = `${profile.name.toLocaleLowerCase()}${profile.lastName.toLocaleLowerCase()}`;
        const xdvWallet = new Wallet({ isWeb: true });

        await xdvWallet.open(accountName, profile.passphrase);

        await xdvWallet.enrollAccount({
          passphrase: profile.passphrase,
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
          walletId,
          profileName: accountName,
          name: profile.name,
          lastName: profile.lastName,
          createdAt: created,
          email: profile.email,
          address: profile.address,
          phone: profile.phone,
          dateBirth: profile.dateBirth,
          created: profile.created,
          passphrase: profile.passphrase,
        };
        global.localStorage.setItem(account, JSON.stringify(walletStorage));
        const currentProfile = {
          ...profile,
          created,
          did: walletDid,
          walletAddress,
        };
        dispatch(doSetProfile(currentProfile));
        dispatch(setCurrentWallet(account, router));
      }
    };
    bootstrapAsync();
  }, [profile, step]);

  return (
    <PdModal isOpen={open}>
      <PdModalBody className="account-pd-modal">
        <h1>Create your PAID account</h1>
        <p>Create your DID account to start using PAID Smart Agreements</p>
        {step === 0
          ? <FormAccountStepOne setStpe={setStpe} setProfile={setProfile} />
          : <FormAccountStepTwo setStpe={setStpe} setProfile={setProfile} profile={profile} />}
      </PdModalBody>
    </PdModal>
  );
};

export default AccountModal;
