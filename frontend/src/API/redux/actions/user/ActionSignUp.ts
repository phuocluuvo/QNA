import { FormSignUp } from "@/API/type/Form.type";
import { responseHandler } from "../ResponseHandler";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { requesting } from "../../reducers/GlobalSlice";
import api from "@/API/api";

export default function actionSignUp(
  form: FormSignUp,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    api.requestSignUp(form).then((res: any) => {
      console.log("requestSignUp:", res);
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          false,
          () => {},
          () => {}
        )
      );
    });
  };
}
