interface ReferralAgreementData {
  customTitle: string;
  partyName: string;
  partyEmail: string;
  partyAddress: string;
  partyWallet: string;
  date: string;
  counterPartyName: string;
  counterPartyEmail: string;
  counterPartyAddress: string;
  counterPartyWallet: string;
  typeOfCompany: string;
  terminationDate: string | undefined;
  stateOfCompany: string;
  geographicState: string;
  county: string;
  commision: number;
  commisionDate: string | undefined;
}

export default ReferralAgreementData;
