import ActionModel from '../../models/actionModel';
import AgreementStateModel from '../../models/agreementStateModel';
import AgreementActionTypes from '../actionTypes/agreement';

const initialState: AgreementStateModel = {
  agreements: [],
  loading: false,
  error: '',
  currentAgreement: null,
  isEditing: false,
  agreementReviewed: false,
};

const agreementReducer = (
  state: AgreementStateModel = initialState,
  action: ActionModel,
) => {
  const { type, payload } = action;
  switch (type) {
    case AgreementActionTypes.LOAD_AGREEMENTS: {
      return {
        ...state,
        isEditing: false,
        agreementReviewed: false,
        agreements: payload.agreements,
      };
    }
    case AgreementActionTypes.SET_IS_EDITING: {
      return {
        ...state,
        isEditing: payload.isEditing,
      };
    }
    case AgreementActionTypes.SET_AGREEMENT_REVIEWED: {
      return {
        ...state,
        agreementReviewed: payload.agreementReviewed,
      };
    }
    case AgreementActionTypes.CREATE_AGREEMENT: {
      return {
        ...state,
        agreements: [...state.agreements, payload.newAgreement],
      };
    }
    case AgreementActionTypes.UPDATE_AGREEMENT: {
      const { cid } = payload;
      const { agreements } = state;
      let currentAgreement = agreements.find(
        (agreement) => agreement.event.cid === cid,
      );

      if (currentAgreement) {
        const indextToUpdate = agreements.findIndex(
          (agreement) => agreement.event.cid === cid,
        );
        currentAgreement = { ...currentAgreement, ...payload.data };
        agreements[indextToUpdate] = currentAgreement;
      }

      return {
        ...state,
        agreements,
      };
    }
    default:
      return { ...state };
  }
};

export default agreementReducer;
