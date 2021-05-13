import React, { FC } from 'react';
import { Navbar } from 'reactstrap';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import ProfileCard from '../reusable/ProfileCard';

type SideBarProps = {
  routerName: string;
};

const SideBar: FC<SideBarProps> = ({ routerName }) => {
  const profile = useSelector((state: any) => state.profileReducer.profile);
  const {
    name,
    did,
  } = profile;

  const emptyProfile = !(name && did);

  return (
    <Navbar className="sidebar" color="primary" light>
      <div className="logos mt-2">
        <img
          className="logo d-block mx-auto pb-4"
          src="/assets/images/logo.png"
          alt=""
        />
      </div>
      <hr />
      <Link href="/profile">
        <a>
          <div className="profile-card mt-2">
            <ProfileCard profile={profile} />
          </div>
        </a>
      </Link>
      <div className="menu mt-5">
        <ul className="pl-3">
          <Link href="/agreements">
            <li className={classnames('mb-4', { 'no-cursor': emptyProfile })}>
              <a>
                <img className="mr-3" src="/assets/icon/list-log.svg" alt="" />
                {' '}
                Standard Agreements
              </a>
            </li>
          </Link>
          <Link href="/smart_agreements">
            <li className={classnames('mb-4', { 'no-cursor': emptyProfile })}>
              <a>
                <img className="mr-3" src="/assets/icon/smartAgreement.svg" alt="" />
                {' '}
                Smart Agreements
              </a>
            </li>
          </Link>
          <li className={classnames('mb-4', { 'no-cursor': emptyProfile })}>
            <img className="mr-3" src="/assets/icon/paid.svg" alt="" />
            {' '}
            1,458 PAID
          </li>
          <li className={classnames('mb-4', { 'no-cursor': emptyProfile })}>
            <img className="mr-3" src="/assets/icon/binanceSmartChain.svg" alt="" />
            Binance Smart Chain
          </li>
        </ul>
      </div>

      <div className="menu-bottom mt-5 pt-5">
        <ul className="pl-3">
          
          <li className="mb-4 no-cursor">
            <img className="mr-3" src="/assets/icon/profile.svg" alt="" />
            Network: RINKEBY
          </li>
        </ul>
      </div>
    </Navbar>
  );
};

SideBar.propTypes = {
  routerName: PropTypes.string.isRequired,
};

export default SideBar;
