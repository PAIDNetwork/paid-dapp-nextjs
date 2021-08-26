import React from 'react';
import Head from 'next/head';

const BuyPaid: React.FC = () => (
  <>
    <Head>
      <title>Paid-Dapp Smart Agreeements</title>
      <link rel="icon" href="/assets/icon/.ico" />
    </Head>

    <div className="agreements m-0 p-0 px-4 container-fluid">
      <div className="row m-0 p-0 h-100">
        <div className="col-12 py-4 d-flex">
          <h3 className="d-flex mr-auto">Staking</h3>
        </div>
      </div>
      <div className="row m-0 pt-xl-5 pt-md-3 pt-sm-0 h-100 d-flex justify-content-center align-items-center">
        <div className="col-xl-7 col-lg-8 col-md-10 col-sm-12 align-self-center">
          <div className="card shadow">
            <div className="card-body text-center paid-coming-soon">
              <h1 className="paid-gradient">Coming Soon</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default BuyPaid;
