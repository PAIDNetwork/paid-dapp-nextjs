import { ActionCreator } from "redux";
import {
  ActionWakuSetClient,
  ActionWakuSetLoading,
  WakuActionNames,
} from "@/redux/actionTypes/waku";
import { Waku } from "js-waku";

export const wakuStartLoading: ActionCreator<ActionWakuSetLoading> = () => ({
  type: WakuActionNames.WAKU_SET_LOADING,
  payload: true,
});

export const wakuStopLoading: ActionCreator<ActionWakuSetLoading> = () => ({
  type: WakuActionNames.WAKU_SET_LOADING,
  payload: false,
});

export const setWakuClient: ActionCreator<ActionWakuSetClient> = (
  newClient: Waku
) => ({
  payload: newClient,
  type: WakuActionNames.WAKU_SET_CLIENT,
});
