interface ConsultingAgreementData {
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
  state: string;
  typeOfCompany: string;
  descriptionConsulting: string;
  serviceRenderChecked: boolean;
  serviceRender: string;
  serviceRate: string;
  servicePayable: string;
  serviceAmountLimit: string;
  consultantChecked: boolean;
  consultanShall: string;
  consultantExecutionAmount: string;
  consultantCompletionAmount: string;
  companyWillChecked: boolean;
  companyWillRecommend: string;
  companyShares: string;
  companyFollows: string;
  otherChecked: boolean;
  other: string;
  companiesExcluded: string;
  listCompanies: string;
}

export default ConsultingAgreementData;
