import { FormQuestion } from "@/API/type/Form.type";

import questionDataList from "@/util/mock/QuestionDataList.mock";
import {
  failureGetQuestionList,
  requestGetQuestionList,
  successGetQuestionList,
} from "../../reducers/QuestionSlice";
import { responseHandler } from "../ResponseHandler";
import { finishedRequest, requesting } from "../../reducers/GlobalSlice";
import api from "@/API/api";
import { QuestionListType } from "@/util/type/Question.type";
export default function actionGetQuestionList(
  query: { page: number; limit: number },
  callbackSuccess: (res: QuestionListType) => {},
  callbackError: () => {}
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
    // dispatch(finishedRequest());

    // if (questionDataList) {
    //   // sort by createdAt
    //   let sortedQuestion = [...questionDataList.items].sort(
    //     (a: any, b: any) =>
    //       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //   );
    //   let newQuestionDataList = {
    //     ...questionDataList,
    //     items: sortedQuestion,
    //   };
    //   let fakeData = {
    //     data: {
    //       data: { data: newQuestionDataList },
    //     },
    //     status: 200,
    //   };
    //   dispatch(
    //     responseHandler(
    //       fakeData,
    //       callbackSuccess,
    //       callbackError,
    //       true,
    //       successGetQuestionList,
    //       failureGetQuestionList
    //     )
    //   );
    // }
  };
}
