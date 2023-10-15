import {
  failureCreateQuestion,
  requestCreateQuestion,
  successCreateQuestion,
} from "../../reducers/QuestionSlice";
import { FormCreateQuestion } from "@/API/type/Form.type";
import { responseHandler } from "../ResponseHandler";
import { finishedRequest, requesting } from "../../reducers/GlobalSlice";
import questionDataList from "@/util/mock/QuestionDataList.mock";
import { QuestionType } from "@/util/type/Question.type";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import api from "@/API/api";

export default function actionCreateQuestion(
  form: FormCreateQuestion,
  callbackSuccess: (res: QuestionType) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestCreateQuestion());
    api.createQuestion(form).then((res: any) => {
      console.log("createQuestion:", res);
      dispatch(successCreateQuestion(res));
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          true,
          successCreateQuestion,
          failureCreateQuestion
        )
      );
    });
  };
}
