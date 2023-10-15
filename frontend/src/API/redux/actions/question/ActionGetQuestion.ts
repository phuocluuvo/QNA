import Api from "@/API/api";
import {
  failureGetQuestion,
  requestGetQuestion,
  successGetQuestion,
} from "../../reducers/QuestionSlice";
import { FormQuestion } from "@/API/type/Form.type";
import { responseHandler } from "../ResponseHandler";
import { finishedRequest, requesting } from "../../reducers/GlobalSlice";
import questionDataList from "@/util/mock/QuestionDataList.mock";
import { QuestionType } from "@/util/type/Question.type";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

export default function actionGetQuestion(
  form: FormQuestion,
  callbackSuccess: (res: QuestionType) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestGetQuestion());
    Api.getQuestion(form).then((res: any) => {
      console.log("getQuestion:", res);
      dispatch(successGetQuestion(res.data));
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          true,
          successGetQuestion,
          failureGetQuestion
        )
      );
    });
  };
}
