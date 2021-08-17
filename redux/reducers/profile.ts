import ActionModel from '../../models/actionModel';
import ProfileStateModel from '../../models/profileStateModel';
import ProfileActionTypes from '../actionTypes/profile';

const initialState: ProfileStateModel = {
  profile: {
    name: '',
    address: '',
    did: undefined,
  },
  loading: false,
  error: '',
};

const profileReducer = (state: ProfileStateModel = initialState, action: ActionModel) => {
  const { type, payload } = action;
  switch (type) {
    case ProfileActionTypes.SET_PROFILE_DATA: {
      const newProfile = payload;
      return {
        ...state,
        profile: {
          ...state.profile,
          ...newProfile,
        },
      };
    }
    default:
      return { ...state };
  }
};

export default profileReducer;
