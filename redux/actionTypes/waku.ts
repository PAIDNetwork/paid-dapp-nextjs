import { Waku } from "js-waku";
import { Action } from "redux";

export enum WakuActionNames {
  WAKU_SET_LOADING = "WAKU_SET_LOADING",
  WAKU_SET_CLIENT = "WAKU_SET_CLIENT",
}

export interface ActionWakuSetLoading extends Action<WakuActionNames> {
  type: WakuActionNames.WAKU_SET_LOADING;
  payload: boolean;
}

export interface ActionWakuSetClient extends Action<WakuActionNames> {
  type: WakuActionNames.WAKU_SET_CLIENT;
  payload?: Waku;
}

export type WakuActions = ActionWakuSetLoading | ActionWakuSetClient;
