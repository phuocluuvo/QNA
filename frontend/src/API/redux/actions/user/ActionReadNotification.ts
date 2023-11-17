import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";
import { requesting } from "../../reducers/GlobalSlice";

export function ActionReadNotification(
  id: string,
  callbackSuccess: (res: any) => void,
  callbackError: (err: any) => void
) {
  return function (dispatch: any) {
    dispatch(requesting());
    api.readNotification(id).then(function (res) {
      console.log("readNotification:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
