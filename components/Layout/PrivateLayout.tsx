import React, { FC, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { NextRouter, useRouter } from 'next/router';
import { Spinner } from 'reactstrap';

import SideBar from './SideBar';

import useWindowSize from '../../hooks/useWindowsSize';
import { useWakuSetup } from './useWakuSetup';

type PrivateLayoutProps = {
  /** Page component */
  children: any;
  /** current router name  */
  routerName: string;
};

const PrivateLayout: FC<PrivateLayoutProps> = ({ children, routerName }) => {
  const isOpen = useSelector((state: any) => state.menuReducer.isOpen);
  const size = useWindowSize();
  const router: NextRouter = useRouter();
  const currentWallet = useSelector(
    (state: any) => state.walletReducer.currentWallet,
  );

  useEffect(() => {
    if (!currentWallet) {
      router.push('/');
    }
  }, []);

  // Waku v2 messaging hook
  useWakuSetup();

  if (!currentWallet) {
    return (
      <div className="layout d-flex justify-content-center align-items-center pt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="layout d-flex">
      
      <div className={isOpen ? "sidebar d-inline-block" : "collapse_sidebar d-inline-block"}>
        <SideBar routerName={routerName} />
      </div>
      <div className="main-content container-fluid d-inline-block m-0 p-0">
        {children}
      </div>
    </div>
  );
};

PrivateLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  routerName: PropTypes.string.isRequired,
};
PrivateLayout.defaultProps = {
  children: null,
};

export default PrivateLayout;
