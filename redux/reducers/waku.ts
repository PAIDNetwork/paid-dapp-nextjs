import { Reducer } from "redux";
import { WakuStateModel } from "@/models/wakuStateModel";
import { WakuActionNames, WakuActions } from "@/redux/actionTypes/waku";

const initialState: WakuStateModel = {
  loading: false,
};

export type WakuReducerType = Reducer<WakuStateModel, WakuActions>;

const wakuReducer: WakuReducerType = (
  state = initialState,
  action
): WakuStateModel => {
  switch (action.type) {
    case WakuActionNames.WAKU_SET_LOADING:
      return { ...state, loading: action.payload };

    case WakuActionNames.WAKU_SET_CLIENT:
      return { ...state, waku: action.payload };

    default:
      return state;
  }
};

export default wakuReducer;
