import React, { FC } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import ProfileModel from '../../models/profileModel';

type ProfileCardProps = {
  /** profile information */
  profile: ProfileModel;
};

const ProfileCard: FC<ProfileCardProps> = ({ profile }) => {
  const isOpen = useSelector((state: any) => state.menuReducer.isOpen);

  return (
    <div className={isOpen ? 'profile-component mt-4 mx-auto' : 'collapse-profile-component mt-4 mx-auto'}>
      <img src="/assets/images/marty.jpg" alt="" />
      <div className="info d-inline-block ml-1">
        <span className="name d-block">
          {' '}
          {profile ? `${profile?.name} ${profile?.lastName}` : 'No data yet' }
        </span>
        <p className="network">PAID Network</p>
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
  }),
};

ProfileCard.defaultProps = {
  profile: null,
};

export default ProfileCard;
