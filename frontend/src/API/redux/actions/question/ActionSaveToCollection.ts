import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";
import { requesting } from "../../reducers/GlobalSlice";
import { FormCreateQuestion } from "@/API/type/Form.type";
import { QuestionType } from "@/util/type/Question.type";
import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";

export default function actionSaveToCollection(
  questionId: string,
  callbackSuccess: (res: QuestionType) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    api.bookmarkQuestion(questionId).then((res: any) => {
      console.log("actionSaveToCollection:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
