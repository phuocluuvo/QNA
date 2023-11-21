import {
  failureGetQuestionList,
  requestGetQuestionList,
  successGetQuestionList,
} from "../../reducers/QuestionSlice";
import { responseHandler } from "../ResponseHandler";
import { finishedRequest, requesting } from "../../reducers/GlobalSlice";
import api from "@/API/api";
import { QuestionHistoryListType, QuestionListType } from "@/util/type/Question.type";
import { GetQuesionParams } from "@/API/type/params/Question.params";
export default function actionGetQuestionList(
  query: GetQuesionParams,
  callbackSuccess: (res: QuestionListType) => {} | void,
  callbackError: () => void
) {
  return (dispatch: any) => {
    dispatch(requesting());
    dispatch(requestGetQuestionList());
    api.getQuestionList(query).then((res: any) => {
      console.log("getQuestionList:", res);
      dispatch(finishedRequest());
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          true,
          successGetQuestionList,
          failureGetQuestionList
        )
      );
    });
  };
}

export const actionGetQuestionHistory = (
  id: string,
  callbackSuccess: (res: QuestionHistoryListType) => {} | void,
  callbackError: () => void
) => {
  return (dispatch: any) => {
    dispatch(requesting());
    dispatch(requestGetQuestionList());
    api.getQuestionHistory(id).then((res: any) => {
      console.log("get Question List History:", res);
      dispatch(finishedRequest());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
};
