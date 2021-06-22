import { Waku } from "js-waku";

export interface WakuStateModel {
  waku?: Waku;
  loading: boolean;
}
