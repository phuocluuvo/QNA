import { Dispatch } from "react";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";
import { AnyAction } from "@reduxjs/toolkit";
import { FormApproveAnswer } from "@/API/type/Form.type";
import api from "@/API/api";

export default function actionApproveAnswer(
  form: FormApproveAnswer,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    api.approveAnswer(form).then((res: any) => {
      console.log("approveAnswer:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
