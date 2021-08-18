import React, { FC, useEffect, useState } from 'react';
import { Navbar } from 'reactstrap';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { useWallet } from 'react-binance-wallet';

import setOpenMenu from '@/redux/actions/menu';
import useContract from '../../hooks/useContract';
import ProfileCard from '../reusable/ProfileCard';

type SideBarProps = {
  routerName: string
}

const sideBarItems = [
  {
    link: '/agreements',
    icon: 'standardAgreements.svg',
    title: 'Standard Agreements',
  },
  {
    link: '/smart_agreements',
    icon: 'smartAgreement.svg',
    title: 'Smart Agreements',
  },
  {
    link: '/binance_chain',
    icon: 'binanceSmartChain.svg',
    title: 'BSC Bridge',
  },
  {
    link: '/buy-paid',
    icon: 'buyPaid.svg',
    title: 'Buy PAID',
  },
  {
    link: '/launchpads',
    icon: 'launchpads.svg',
    title: 'Launchpads',
  },
  {
    link: '/staking',
    icon: 'staking.svg',
    title: 'Staking',
  },
];

const SideBar: FC<SideBarProps> = ({ routerName }) => {
  const { tokenContract, networkName } = useContract();
  const {
    balance, connector, account, reset,
  } = useWallet();
  const [toggleVisible, setToggleVisible] = useState(false);
  const [paidToken, setPaidToken] = useState(0);
  const isOpen = useSelector((state: any) => state.menuReducer.isOpen);
  const currentWallet = useSelector(
    (state: { walletReducer: any }) => state.walletReducer.currentWallet,
  );
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profileReducer.profile);
  const { name, did } = profile;

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

  const paidSmallLogo = '/assets/icon/logoSmall.svg';
  const collapseOut = '/assets/icon/collapse_out.png';
  const [smallLogo, setSmallLogo] = useState(paidSmallLogo);

  return (
    <Navbar
      className={isOpen ? 'sidebar' : 'collapse_sidebar'}
      color="primary"
      light
      onMouseEnter={() => {
        setToggleVisible(true);
      }}
      onMouseLeave={() => {
        setToggleVisible(false);
      }}
    >
      {isOpen ? (
        <div className="logos mt-2">
          <img
            className={
              toggleVisible
                ? 'left logo d-block mx-auto pb-4'
                : 'logo d-block mx-auto pb-4'
            }
            src="/assets/images/logo.svg"
            alt=""
          />
          <div
            className={
              toggleVisible ? 'button-collapse' : 'hide-button-collapse'
            }
          >
            <img
              style={{
                width: '30px',
                height: '30px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              src="/assets/icon/collapse_in.png"
              alt=""
              onClick={() => {
                setSmallLogo(paidSmallLogo);
                dispatch(setOpenMenu(!isOpen));
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <img
            className="logo d-block mx-auto pb-4"
            src={smallLogo}
            alt=""
            width={40}
            onMouseEnter={() => setSmallLogo(collapseOut)}
            onMouseLeave={() => setSmallLogo(paidSmallLogo)}
            onClick={() => dispatch(setOpenMenu(!isOpen))}
          />
        </div>
      )}

      <div className="menu mt-5">
        {
          sideBarItems.map((item) => (
            <Link href={item.link}>
              <div className={`menu-item ${routerName === item.link ? 'active' : ''}`}>
                <img src={`/assets/icon/${item.icon}`} alt="" />
                {isOpen ? item.title : ''}
              </div>
            </Link>
          ))
        }
      </div>
      <hr />

      {account && (
        <div className="menu">
          <p>Wallet</p>
          <li className="menu-item">
            <img src="/assets/icon/paid.svg" alt="" />
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
          </li>
          <li className="menu-item">
            <img src="/assets/icon/ethereum.svg" alt="" />
            <div className="account">
              <span>
                {account.slice(0, 4)}
                ...
                {account.slice(38, 42)}
              </span>
              <img className="disconnect" src="/assets/icon/disconnect.svg" alt="" onClick={reset} />
            </div>
          </li>
        </div>
      )}

      <div className="menu-bottom mt-5 pt-5">
        <Link href="/profile">
          <a className={routerName === '/profile' ? 'selected' : ''}>
            <div className="profile-card mt-2">
              <ProfileCard profile={profile} />
            </div>
          </a>
        </Link>

        <ul className="pl-3">
          <li className={classnames('mb-4 no-cursor')}>
            <img className="mr-3" src="/assets/icon/networkBi.svg" alt="" />
            Network:
            {' '}
            {networkName}
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
