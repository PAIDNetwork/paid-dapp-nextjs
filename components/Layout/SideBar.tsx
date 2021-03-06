import React, { FC, useEffect, useState } from 'react';
import { Navbar } from 'reactstrap';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'react-binance-wallet';

import setOpenMenu from '@/redux/actions/menu';
import useContract from '../../hooks/useContract';
import ProfileCard from '../reusable/ProfileCard';
import SocialMedia from '../reusable/SocialMedia';

type SideBarProps = {
  routerName: string
}

const sideBarItems = [
  {
    link: '/agreements',
    icon: 'standardAgreements.svg',
    iconSelected: 'standardAgreements_selected.svg',
    title: 'Standard Agreements',
  },
  {
    link: '/smart_agreements',
    icon: 'smartAgreement.svg',
    iconSelected: 'smartAgreement_selected.svg',
    title: 'Smart Agreements',
  },
  {
    link: '/binance_chain',
    icon: 'binanceSmartChain.svg',
    iconSelected: 'binanceSmartChain_selected.svg',
    title: 'BSC Bridge',
  },
  {
    link: '/buy-paid',
    icon: 'buyPaid.svg',
    iconSelected: 'buyPaid_selected.svg',
    title: 'Buy PAID',
  },
  {
    link: '/launchpads',
    icon: 'launchpads.svg',
    iconSelected: 'launchpads_selected.svg',
    title: 'Launchpads',
  },
  {
    link: '/staking',
    icon: 'staking.svg',
    iconSelected: 'staking_selected.svg',
    title: 'Staking',
  },
];

const SideBar: FC<SideBarProps> = ({ routerName }) => {
  const { tokenContract, networkName } = useContract();
  const {
    balance, connector, account, reset,
  } = useWallet();
  const [paidToken, setPaidToken] = useState(0);
  const isOpen = useSelector((state: any) => state.menuReducer.isOpen);
  const currentWallet = useSelector(
    (state: { walletReducer: any }) => state.walletReducer.currentWallet,
  );
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profileReducer.profile);

  useEffect(() => {
    const getToken = async () => {
      try {
        const tokenBalance = await tokenContract.balanceOf(currentWallet);
        setPaidToken(tokenBalance.toString() / 1e18);
      } catch (error) {
        setPaidToken(0);
      }
    };

    if (tokenContract) getToken();
  }, [tokenContract]);

  return (
    <Navbar
      className={`sidebar ${isOpen ? '' : 'collapse'}`}
      color="primary"
      light
    >
      <div className="logos mt-4">
        <img
          className="logo"
          src={`/assets/images/${isOpen ? 'logo.svg' : 'logoSmall.svg'}`}
          alt=""
        />
        <button
          type="button"
          className="btn-collapse"
          onClick={() => {
            dispatch(setOpenMenu(!isOpen));
          }}
        >
          <img
            src={`/assets/icon/${isOpen ? 'collapse_in.svg' : 'collapse_out.svg'}`}
            alt=""
          />
        </button>
      </div>

      {
        isOpen && <SocialMedia />
      }
      <div className="menu">
        {
          sideBarItems.map((item) => (
            <Link href={item.link}>
              <div className={`menu-item ${routerName === item.link ? 'active' : ''}`}>
                <img src={`/assets/icon/${routerName === item.link ? item.iconSelected : item.icon}`} alt="" />
                {isOpen ? item.title : ''}
              </div>
            </Link>
          ))
        }
      </div>
      <hr />

      {account && (
        <div className="menu">
          {isOpen && <p>Wallet</p>}
          <li className="menu-item">
            <img src="/assets/icon/paid.svg" alt="" />
            {isOpen && (
            <div>
              <span>
                {paidToken.toFixed(4)}
                &nbsp;PAID
              </span>
              <br />
              <span>
                {((balance as any) / 1e18).toFixed(4)}
                &nbsp;
                {connector !== 'bsc' ? 'ETH' : 'BNB'}
              </span>
            </div>
            )}

          </li>
          <li className="menu-item">
            <img src={`/assets/icon/${networkName === 'bnbt' || networkName === 'bnb' ? 'binanceSmartChain.svg' : 'ethereum.svg'}`} alt="" />
            {isOpen && (
            <div className="account">
              <span>
                {account.slice(0, 4)}
                ...
                {account.slice(38, 42)}
              </span>
              <button type="button" className="disconnect" onClick={reset}>
                <img src="/assets/icon/disconnect.svg" alt="" />
              </button>
            </div>
            )}
          </li>
        </div>
      )}

      <div className="menu-bottom">
        <Link href="/profile">
          <div className="profile-card">
            <ProfileCard profile={profile} selected={routerName === '/profile'} />
          </div>
        </Link>
      </div>
    </Navbar>
  )
}

SideBar.propTypes = {
  routerName: PropTypes.string.isRequired,
}

export default SideBar
