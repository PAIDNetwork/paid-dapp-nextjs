import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { Card } from 'reactstrap';
import ProfileStateModel from '../models/profileStateModel';
import FormProfile from '../components/profile/FormProfile';
import ProfileModel from '../models/profileModel';
import doSetProfile from '../redux/actions/profile';

const Profile: FC = () => {
  const dispatch = useDispatch();
  const profileState: ProfileStateModel = useSelector(
    (state: any) => state.profileReducer,
  );

  // const currentWallet = useSelector(
  //   (state) => state.walletReducer.currentWallet,
  // );

  const [profile, setProfile] = useState<ProfileModel>(profileState.profile);

  const { name } = profile;
  const emptyProfile = !name;

  const onSubmit = (values: ProfileModel) => {
    const created = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).format(new Date());
    const currentProfile = {
      ...values,
      created,
      did: 'didkeyz6kghijklXXJPT17VIakupmu89NSTYI8mni',
      address: '0x9e81de93dC...47e6d64b70ff1dF',
    };
    dispatch(doSetProfile(currentProfile));
    setProfile(currentProfile);
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
    </>
  );
};

export default Profile;
