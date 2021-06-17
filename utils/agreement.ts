export const columnsAgreement = [
  {
    // Header: 'Counterparty',
    Header: 'Party A',
    accessor: 'data.counterpartyName',
  },
  {
    Header: 'Party A DID',
    // Header: 'Title',
    accessor: 'data.documentName',
  },
  {
    Header: 'Party B',
    // Header: 'Last Modified',
    accessor: 'event.updatedAt',
  },
  {
    Header: 'Party B DID',
    // Header: 'Created',
    accessor: 'event.createdAt',
  },
  {
    Header: 'Signed on',
    accessor: 'event.signedOn',
  },
];

// no-unused-vars
export enum agreementStatus {
  PENDING = 1,
  DECLINED = 2,
  SIGNED = 3,
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
