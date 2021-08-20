import React, { FC } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import ProfileModel from '../../models/profileModel';

type ProfileCardProps = {
  /** profile information */
  profile: ProfileModel;
  selected: boolean;
};

const ProfileCard: FC<ProfileCardProps> = ({ profile, selected }) => {
  const isOpen = useSelector((state: any) => state.menuReducer.isOpen);

  const getProfileInitials = () => {
    let initials = '';
    initials += profile !== null && profile.name ? profile.name.charAt(0) : '';
    initials += profile !== null && profile.lastName ? profile.lastName.charAt(0) : '';
    return initials;
  };

  return (
    <div className={`profile-container ${selected ? 'selected' : ''}`}>
      <div className={isOpen ? `profile-component ${selected ? 'selected' : ''}` : 'collapse-profile-component mx-auto'}>
        <div className={`profileImage ${selected ? 'selected' : ''}`}>
          <span>{getProfileInitials()}</span>
        </div>
        <div className="info ml-1">
          <span className="name d-block">
            {profile ? `${profile?.name} ${profile?.lastName}` : 'No data yet' }
          </span>
          <button type="button" className="btn-details">
            <img src={`/assets/icon/${selected ? 'profileArrowUp_selected.svg' : 'profileArrowUp.svg'}`} alt="" />
          </button>
        </div>
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
