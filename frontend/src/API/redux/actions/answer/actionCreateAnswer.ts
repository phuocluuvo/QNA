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
