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

  const getProfileInitials = () => {
    let initials = '';
    initials += profile !== null && profile.name ? profile.name.charAt(0) : '';
    initials += profile !== null && profile.lastName ? profile.lastName.charAt(0) : '';
    return initials;
  };

  return (
    <div className={isOpen ? 'profile-component mt-4 mx-auto padding-card' : 'collapse-profile-component mt-4 mx-auto padding-card'}>
      <div className="profileImage">{getProfileInitials()}</div>
      <div className="info d-inline-block ml-1">
        <span className="name d-block">
          {profile ? `${profile?.name} ${profile?.lastName}` : 'No data yet' }
        </span>
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
