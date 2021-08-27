import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Magic } from 'magic-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'react-binance-wallet';
import { Wallet } from 'xdv-universal-wallet-core';
import { PdModal, PdModalBody } from '@/pdComponents';

import ProfileModel from '@/models/profileModel';
import { setCurrentWallet } from '../../redux/actions/wallet';
import doSetProfile from '../../redux/actions/profile';
import helper from '../../utils/helper';
import FormLogin from './FormLogin';

interface AccountModalProps {
  open: boolean;
}

const createMagic = (key) => typeof window !== 'undefined' && new Magic(key);
const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_API_KEY);

const LoginModal: FC<AccountModalProps> = ({ open }: AccountModalProps) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const [profile, setProfile] = useState<ProfileModel>({});
  // const [magic] = useState<Magic>(new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY));
  const router = useRouter();
  const { query } = useRouter();
  const { formatDateProfile } = helper;

  useEffect(() => {
    const bootstrapAsync = async () => {
      if (profile.passphrase && profile.passphrase !== '') {
        const created = formatDateProfile(new Date());
        const accountName = `${profile.name.toLocaleLowerCase()}${profile.lastName.toLocaleLowerCase()}`;
        const xdvWallet = new Wallet({ isWeb: true });

        await xdvWallet.open(accountName, profile.passphrase);

        const walletId = await xdvWallet.addWallet();
        const provider = await xdvWallet.createEd25519({
          passphrase: profile.passphrase,
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
          walletId,
          registry: '',
          accountName: profile.name,
        });

        await provider.did.authenticate();
        xdvWallet.close();

        const walletStorage = {
          walletId,
          profileName: accountName,
          name: profile.name,
          lastName: profile.lastName,
          created,
          email: profile.email,
          address: profile.address,
          passphrase: profile.passphrase,
        };
        global.localStorage.setItem(account, JSON.stringify(walletStorage));
        const currentProfile = {
          ...profile,
          created,
          did: provider.did,
        };
        console.log('in current in current');
        dispatch(doSetProfile(currentProfile));
        dispatch(setCurrentWallet(account, router, query));
      }
    };
    bootstrapAsync();
  }, [profile]);

  const login = async (values: any) => {
    try {
      const token = await magic.auth.loginWithMagicLink({
        email: values.email,
      });
      console.log(token);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PdModal isOpen={open}>
      <PdModalBody className="account-pd-modal">
        <h1>Welcome to PAID Smart Agreements</h1>
        <p>
          Enter your email and we&apos;ll send you a link that will sign you in
        </p>
        <FormLogin login={login} />
      </PdModalBody>
    </PdModal>
  );
};

export default LoginModal;
