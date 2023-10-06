import { FromUserLogin } from "@/API/type/Form.type";
import { responseHandler } from "../ResponseHandler";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import {
  failureSignIn,
  requestGetUser,
  successSignIn,
} from "../../reducers/UserSlice";
import { requesting } from "../../reducers/GlobalSlice";
import api from "@/API/api";

export default function actionSignIn(
  form: FromUserLogin,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestGetUser());
    api.requestSignIn(form).then((res: any) => {
      console.log("requestSignIn:", res);
      api.setUserToken(res.data?._token);
      // dispatch(successSignIn(res.data));
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          true,
          successSignIn,
          failureSignIn
        )
      );
    });
  };
}
