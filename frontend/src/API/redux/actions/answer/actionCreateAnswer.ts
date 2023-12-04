import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";
import { requesting } from "../../reducers/GlobalSlice";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { AnswerType } from "@/util/type/Answer.type";
import { FormCreateAnswer } from "@/API/type/Form.type";
import {
  failureCreateAnswer,
  requestCreateAnswer,
  successCreateAnswer,
} from "../../reducers/AnswerSlice";

export default function actionCreateAnswer(
  form: FormCreateAnswer,
  callbackSuccess: (res: AnswerType) => void,
  callbackError: (res: any) => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestCreateAnswer());
    api.createAnswer(form).then((res: any) => {
      console.log("createAnswer:", res);
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          false,
          successCreateAnswer,
          failureCreateAnswer
        )
      );
    });
  };
}

export function actionDeleteAnswer(
  id: string,
  callbackSuccess: (res: AnswerType) => void,
  callbackError: (res: any) => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestCreateAnswer());
    api.deleteAnswer(id).then((res: any) => {
      console.log("deleteAnswer:", res);
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          false,
          successCreateAnswer,
          failureCreateAnswer
        )
      );
    });
  };
}

export function actionUpdateAnswer(
  id: string,
  form: FormCreateAnswer,
  callbackSuccess: (res: AnswerType) => void,
  callbackError: (res: any) => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestCreateAnswer());
    api.updateAnswer(id, form).then((res: any) => {
      console.log("updateAnswer:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
