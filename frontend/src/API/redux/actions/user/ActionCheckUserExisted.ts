import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";

export function actionCheckUserExisted(
  username: string,
  callbackSuccess: (res: any) => void,
  callbackError: (err: any) => void
) {
  return function (dispatch: any) {
    dispatch(requesting());
    api.checkUsernameExisted(username).then(function (res) {
      console.log("checkUserExisted:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
