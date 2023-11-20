import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";

export function actionForgetPassword(
  username: string,
  callbackSuccess: (res: any) => void,
  callbackError: (err: any) => void
) {
  return function (dispatch: any) {
    dispatch(requesting());
    api.forgotPassword(username).then(function (res) {
      console.log("forgetPassword:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
