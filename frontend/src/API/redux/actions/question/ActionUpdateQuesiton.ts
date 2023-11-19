import { QuestionType } from "@/util/type/Question.type";
import {
  failureCreateQuestion as failureUpdateQuestion,
  successCreateQuestion as successUpdateQuestion,
  requestCreateQuestion as requestUpdateQuestion,
} from "../../reducers/QuestionSlice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";
import { FormCreateQuestion } from "@/API/type/Form.type";
import api from "@/API/api";

export default function actionUpdateQuestion(
  form: FormCreateQuestion,
  questionId: string,
  callbackSuccess: (res: QuestionType) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestUpdateQuestion());
    api.updateQuestion(form, questionId).then((res: any) => {
      console.log("updateQuestion:", res);
      dispatch(successUpdateQuestion(res));
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          true,
          successUpdateQuestion,
          failureUpdateQuestion
        )
      );
    });
  };
}
