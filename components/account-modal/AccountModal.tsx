import React, {FC, useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {PdModal, PdModalBody} from '@/pdComponents';
import {useDispatch, useSelector} from 'react-redux';
import {useWallet} from 'react-binance-wallet';
import {Wallet} from 'xdv-universal-wallet-core';

import ProfileModel from '@/models/profileModel';
import ProfileStateModel from '@/models/profileStateModel';
import {setCurrentWallet} from '../../redux/actions/wallet';
import doSetProfile from '../../redux/actions/profile';
import helper from '../../utils/helper';
import FormAccount from './FormAccount';

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
    const {account} = useWallet();
    const [profile, setProfile] = useState<ProfileModel>(profileState.profile);
    const router = useRouter();
    const {query} = useRouter();
    const {formatDateProfile} = helper;

    useEffect(() => {
        const bootstrapAsync = async () => {
            if (profile.passphrase && profile.passphrase !== "") {
                const created = formatDateProfile(new Date());
                const accountName = `${profile.name.toLocaleLowerCase()}${profile.lastName.toLocaleLowerCase()}`;
                const xdvWallet = new Wallet({isWeb: true});

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
                dispatch(doSetProfile(currentProfile));
                dispatch(setCurrentWallet(account, router, query));
            }
        };
        bootstrapAsync();
    }, [profile,]);

    return (
        <PdModal isOpen={open}>
            <PdModalBody className="account-pd-modal">
                <h1>Create your PAID account</h1>
                <p>Create your DID account to start using PAID Smart Agreements</p>
                <FormAccount setProfile={setProfile} profile={profile}/>
            </PdModalBody>
        </PdModal>
    );
};

export default AccountModal;
