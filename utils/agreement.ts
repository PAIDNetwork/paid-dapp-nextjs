export const columnsAgreement = [
  {
    Header: 'Counterparty',
    accessor: 'data.counterpartyName',
  },
  {
    Header: 'Title',
    accessor: 'data.documentName',
  },
  {
    Header: 'Last Modified',
    accessor: 'event.updatedAt',
  },
  {
    Header: 'Created',
    accessor: 'event.createdAt',
  },
  {
    Header: 'Signed on',
    accessor: 'event.signedOn',
  },
];

// no-unused-vars
export enum agreementStatus {
  PENDING_SIGNATURE,
  ACCEPTED,
  DECLINED,
}

export const PARTY_NAME_FIELD = 'partyName';
export const PARTY_EMAIL_FIELD = 'partyEmail';
export const PARTY_ADDRESS_FIELD = 'partyAddress';
export const PARTY_WALLET_FIELD = 'partyWallet';
export const AGREEMENT_CREATE_DATE_FIELD = 'createDate';
export const AGREEMENT_TITLE_FIELD = 'customTitle';
export const COUNTER_PARTY_NAME_FIELD = 'counterPartyName';
export const COUNTER_PARTY_EMAIL_FIELD = 'counterPartyEmail';
export const COUNTER_PARTY_ADDRESS_FIELD = 'counterPartyAddress';
export const COUNTER_PARTY_WALLET_FIELD = 'counterPartyWallet';
export const COMPANY_NAME_FIELD = 'companyName';
export const COMPANY_STATE_FIELD = 'stateOfCompany';
export const DATE_FIELD = 'date';
export const COMPANY_TYPE_FIELD = 'typeOfCompany';
export const PROVIDER_NAME_FIELD = 'providerName';
export const PROVIDER_STATE_FIELD = 'stateOfProvider';
export const PROVIDER_TYPE_FIELD = 'typeOfProvider';
export const TERMINATION_DATE_FIELD = 'terminationDate';
export const COUNTY_FIELD = 'county';
export const COMISSION_FIELD = 'commision';
export const COMISSION_DATE_FIELD = 'commisionterminationDate';
export const TITLE_COMPANY_FIELD = 'titleCompany';
export const TITLE_PROVIDER_FIELD = 'titleProvider';