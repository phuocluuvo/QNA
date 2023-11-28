import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";

export function ActionReadAllNotification(
  callbackSuccess = (res: any) => {},
  callbackError = (err: any) => {}
) {
  return function (dispatch: any) {
    dispatch(requesting());
    api.readAllNotification().then(function (res: any) {
      console.log("readAllNotification:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
