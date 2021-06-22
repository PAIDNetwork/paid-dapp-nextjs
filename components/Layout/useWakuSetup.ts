import {
  setWakuClient,
  wakuStartLoading,
  wakuStopLoading,
} from "@/redux/actionCreators/waku";
import { WakuActions } from "@/redux/actionTypes/waku";
import { getStatusFleetNodes, Waku } from "js-waku";
import { Dispatch, useEffect } from "react";
import { useDispatch } from "react-redux";

async function wakuSetup(dispatch: Dispatch<WakuActions>) {
  dispatch(wakuStartLoading());

  const [statusImNodes, client] = await Promise.all([
    getStatusFleetNodes(),
    Waku.create({}),
  ]);

  await Promise.all(
    statusImNodes.map((node) => {
      client.dial(node);
    })
  );

  dispatch(setWakuClient(client));
  dispatch(wakuStopLoading());
}

/**
 * Setups the Waku client and adds it to the Redux Store
 */
export function useWakuSetup() {
  const dispatch = useDispatch();
  useEffect(() => {
    wakuSetup(dispatch);
  }, [dispatch]);
}
