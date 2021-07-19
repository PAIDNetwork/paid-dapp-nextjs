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
  routerName: string;
};

const SideBar: FC<SideBarProps> = ({ routerName }) => {
  const { tokenContract, networkName } = useContract();
  const { balance, connector } = useWallet();
  const [toggleVisible, setToggleVisible] = useState(false);
  const [paidToken, setPaidToken] = useState(0);
  const isOpen = useSelector((state: any) => state.menuReducer.isOpen);
  const currentWallet = useSelector(
    (state: { walletReducer: any }) => state.walletReducer.currentWallet,
  );
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profileReducer.profile);
  const {
    name,
    did,
  } = profile;

  useEffect(() => {
    const getToken = async () => {
      if (tokenContract) {
        const tokenBalance = await tokenContract.balanceOf(currentWallet);
        setPaidToken(tokenBalance.toString() / 1E18);
      }
    };
    getToken();
  }, [tokenContract]);

  const paidSmallLogo = '/assets/icon/logoSmall.svg';
  const collapseOut = '/assets/icon/collapse_out.png';
  const [smallLogo, setSmallLogo] = useState(paidSmallLogo);

  const emptyProfile = !(name && did);

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

      {isOpen
        ? (
          <div className="logos mt-2">
            <img
              className={toggleVisible ? 'left logo d-block mx-auto pb-4' : 'logo d-block mx-auto pb-4'}
              src="/assets/images/logo.svg"
              alt=""
            />
            <div className={toggleVisible ? 'button-collapse' : 'hide-button-collapse'}>
              <img
                style={{
                  width: '30px', height: '30px', display: 'block', marginLeft: 'auto', marginRight: 'auto',
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
        )
        : (
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

      <hr />
      <Link href="/profile">
        <a className={routerName === '/profile' ? 'selected' : ''}>
          <div className="profile-card mt-2">
            <ProfileCard profile={profile} />
          </div>
        </a>
      </Link>
      <div className="menu mt-5">
        <ul className="pl-3" style={isOpen ? {} : {paddingLeft: "1.5rem"}}>
          <Link href="/agreements">
            <li className={routerName === '/agreements' ? 'mb-4 active' : 'mb-4'}>
              <a>
                <img className="mr-3" src="/assets/icon/list-log.svg" alt="" />
                {' '}
                Standard Agreements
              </a>
            </li>
          </Link>
          <Link href="/smart_agreements">
            <li className={routerName === '/smart_agreements' ? 'mb-4 active' : 'mb-4'}>
              <a className={routerName === '/smart_agreements' ? 'selected' : ''}>
                <img className="mr-3" src="/assets/icon/smartAgreement.svg" alt="" />
                {' '}
                Smart Agreements
              </a>
            </li>
          </Link>
          <li className={classnames('mb-4', { 'no-cursor': emptyProfile })}>
            <img className="mr-3" src="/assets/icon/paid.svg" alt="" />
            <div>
              <div>
                {' '}
                {paidToken}
                {' '}
                PAID
              </div>
              <div>
                { (balance as any / 1E18) }
                {' '}
                {connector !== 'bsc' ? 'ETH' : 'BNB'}
              </div>
            </div>
          </li>
          <Link href="/binance_chain">
            <li className={routerName === '/binance_chain' ? 'mb-4 active' : 'mb-4'}>
              <a className={routerName === '/binance_chain' ? 'selected' : ''}>
                <img className="mr-3" src="/assets/icon/binanceSmartChain.svg" alt="" />
                Binance Smart Chain
              </a>
            </li>
          </Link>
        </ul>
      </div>

      <div className="menu-bottom mt-5 pt-5">
        <ul className="pl-3">

          <li className="mb-4 no-cursor">
            <a>
              <img className="mr-3" src="/assets/icon/networkBi.svg" alt="" />
              Network:
              {' '}
              { networkName }
            </a>
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
