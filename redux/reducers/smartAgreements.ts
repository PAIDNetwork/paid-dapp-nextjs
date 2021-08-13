/* eslint-disable import/no-unresolved */
import ActionModel from '@/models/actionModel'
import AdvisorAgreementData from '@/models/advisorAgreementData'
import CiiaAgreementData from '@/models/ciiaAgreementData'
import ConsultingAgreementData from '@/models/consultingAgreementData'
import NdaAgreementData from '@/models/ndaAgreementData'
import ReferralAgreementData from '@/models/referralAgreementData'
import SaftAgreementData from '@/models/saftAgreementData'
import SmartAgreementsTypes from '../actionTypes/smartAgreements'

interface SmartAgreementsState {
  ndaAgreementData: any
  advisorAgreementData: AdvisorAgreementData
  ciiaAgreementData: CiiaAgreementData
  consultingAgreementData: ConsultingAgreementData
  referralAgreementData: ReferralAgreementData
  saftAgreementData: SaftAgreementData
}

const initialState: SmartAgreementsState = {
  ndaAgreementData: {} as any,
  advisorAgreementData: {} as any,
  ciiaAgreementData: {
    customTitle: '',
    partyName: '',
    partyEmail: '',
    partyAddress: '',
    partyWallet: '',
    date: '',
    counterPartyName: '',
    counterPartyEmail: '',
    counterPartyAddress: '',
    counterPartyWallet: '',
    effectiveDate: '',
    companyState: '',
    stateConsultant: '',
    typeOfCompanyConsultant: '',
    title: '',
    datea: '',
    idNumberBriefDesc: '',
    stateCompany: '',
    typeOfComapny: '',
    listCompAgreements: '',
  },
  consultingAgreementData: {} as any,
  referralAgreementData: {
    customTitle: '',
    partyName: '',
    partyEmail: '',
    partyAddress: '',
    partyWallet: '',
    date: '',
    counterPartyName: '',
    counterPartyEmail: '',
    counterPartyAddress: '',
    counterPartyWallet: '',
    typeOfCompany: '',
    terminationDate: undefined,
    stateOfCompany: '',
    geographicState: '',
    county: '',
    commision: 0,
    commisionDate: undefined,
  },
  saftAgreementData: {
    customTitle: '',
    partyName: '',
    partyEmail: '',
    partyAddress: '',
    partyWallet: '',
    date: '',
    counterPartyName: '',
    counterPartyEmail: '',
    counterPartyAddress: '',
    counterPartyWallet: '',
    purchaseAmount: 0,
    jurisdiction: '',
    tokenAmount: 0,
    typeOfCompany: '',
    discountRate: 0,
    website: '',
    paymentOption: 'dollar',
    bankName: '',
    address: '',
    aba: '',
    payeeAccount: '',
    payeeAccountName: '',
    ethereum: '',
    bitcoin: '',
  },
}

const smartAgreementsReducer = (
  state: SmartAgreementsState = initialState,
  action: ActionModel,
) => {
  const { type, payload } = action

  switch (type) {
    case SmartAgreementsTypes.SET_NDA_AGREEMENT_DATA: {
      const newNdaData = payload
      return {
        ...state,
        ndaAgreementData: {
          ...state.ndaAgreementData,
          ...newNdaData,
        },
      }
    }
    case SmartAgreementsTypes.SET_ADVISOR_AGREEMENT_DATA: {
      const newAdvisorData = payload
      return {
        ...state,
        advisorAgreementData: {
          ...state.advisorAgreementData,
          ...newAdvisorData,
        },
      }
    }
    case SmartAgreementsTypes.SET_CIIA_AGREEMENT_DATA: {
      const newCiiaData = payload
      return {
        ...state,
        ciiaAgreementData: {
          ...state.ciiaAgreementData,
          ...newCiiaData,
        },
      }
    }
    case SmartAgreementsTypes.SET_CONSULTING_AGREEMENT_DATA: {
      const newConsultingData = payload

      let additionalData = {}
      if (newConsultingData.compensationRadio === 'Hourly rate') {
        additionalData = {
          consultantExecutionAmount: undefined,
          consultantCompletionAmount: undefined,
        }
      } else if (newConsultingData.compensationRadio === 'Fixed compensation') {
        additionalData = {
          serviceRate: undefined,
          servicePayable: undefined,
          serviceAmountLimit: undefined,
        }
      }
      return {
        ...state,
        consultingAgreementData: {
          ...state.consultingAgreementData,
          ...newConsultingData,
          ...additionalData,
        },
      }
    }
    case SmartAgreementsTypes.SET_REFERRAL_AGEEMENT_DATA: {
      const newReferralData = payload
      return {
        ...state,
        referralAgreementData: {
          ...state.referralAgreementData,
          ...newReferralData,
        },
      }
    }
    case SmartAgreementsTypes.SET_SAFT_AGEEMENT_DATA: {
      const newSaftData = payload
      // console.log(newSaftData)
      // if (!newSaftData.ethereum) {
      //   newSaftData.ethereum = ' '
      // }
      // if (!newSaftData.bitcoin) {
      //   newSaftData.bitcoin = ' '
      // }
      return {
        ...state,
        saftAgreementData: {
          ...state.saftAgreementData,
          ...newSaftData,
        },
      }
    }
    case SmartAgreementsTypes.RESET_AGREEMENT_TEMPLATE: {
      return initialState
    }
    default:
      return { ...state }
  }
}

export default smartAgreementsReducer
