import AgreementModel from '@/models/agreementModel';
import AgreementActionTypes from '../actionTypes/agreement';

const getAgreementInfoByIpfs = (ipfsContent: string) => {
  const doc = new global.DOMParser().parseFromString(ipfsContent, 'text/html');
  const documentName = doc.querySelector('#customTitle')?.textContent ?? '';
  const partyAName = doc.querySelector('#partyName')?.textContent ?? '';
  const partyBName = doc.querySelector('#counterPartyName')?.textContent ?? '';

  return { documentName, partyAName, partyBName };
};

const loadAgreements = (agreementsData: Array<any>) => (dispatch: any) => {
  dispatch({
    type: AgreementActionTypes.LOAD_AGREEMENTS,
    payload: { agreements: agreementsData },
  });
};

export const setIsEditing = (isEditing: boolean) => (dispatch: any) => {
  dispatch({
    type: AgreementActionTypes.SET_IS_EDITING,
    payload: { isEditing },
  });
};

export const setAgreementReviewed = (agreementReviewed: boolean) => (
  dispatch: any,
) => {
  dispatch({
    type: AgreementActionTypes.SET_AGREEMENT_REVIEWED,
    payload: { agreementReviewed },
  });
};

export const createAgreement = (newAgreement: AgreementModel) => (
  dispatch: any,
) => {
  const agreementInfo = getAgreementInfoByIpfs(newAgreement.data.fileString);
  const newAgreementData = newAgreement;
  newAgreementData.data.documentName = agreementInfo.documentName;
  newAgreementData.data.counterpartyName = agreementInfo.partyBName;
  dispatch({
    type: AgreementActionTypes.CREATE_AGREEMENT,
    payload: { newAgreement: newAgreementData },
  });
};

export const updateAgreement = (
  cid: number,
  agreementToUpdate: AgreementModel,
) => (dispatch: any) => {
  dispatch({
    type: AgreementActionTypes.UPDATE_AGREEMENT,
    payload: { cid, agreementToUpdate },
  });
};

export default loadAgreements;
