import ActionModel from '../../models/actionModel';
import MenuStateModel from '../../models/menuStateModel';
import MenuActionTypes from '../actionTypes/menu';

const initialState: MenuStateModel = {
  isOpen: true,
};

const menuReducer = (state: MenuStateModel = initialState, action: ActionModel) => {
  const { type, payload } = action;
  switch (type) {
    case MenuActionTypes.SET_OPEN_MENU: {
      return {
        ...state,
        isOpen: payload.isOpen,
      };
    }
    default:
      return { ...state };
  }
};

export default menuReducer;
