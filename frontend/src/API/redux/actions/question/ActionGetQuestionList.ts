import { FormQuestion } from "@/API/type/Form.type";

import questionDataList from "@/util/mock/QuestionDataList.mock";
import {
  failureGetQuestionList,
  requestGetQuestionList,
  successGetQuestionList,
} from "../../reducers/QuestionSlice";
import { responseHandler } from "../ResponseHandler";
import { finishedRequest, requesting } from "../../reducers/GlobalSlice";
export default function actionGetQuestionList(
  callbackSuccess: () => {},
  callbackError: () => {}
) {
  return (dispatch: any) => {
    dispatch(requesting());
    dispatch(requestGetQuestionList());
    // Api.getQuestionList().then((res: any) => {
    //   console.log("getQuestionList:", res);
    //   dispatch(finishedRequest());
    //   let fakeData = {
    //     status: 200,
    //     data: {
    //       ...questionDataList,
    //     },
    //   };
    //   dispatch(
    //     responseHandler(
    //       fakeData,
    //       callbackSuccess,
    //       callbackError,
    //       true,
    //       successGetQuestion,
    //       failureGetQuestion
    //     )
    //   );
    // });
    dispatch(finishedRequest());
    if (questionDataList) {
      // sort by createdDate
      let sortedQuestion = [...questionDataList.postList].sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
      let newQuestionDataList = {
        ...questionDataList,
        postList: sortedQuestion,
      };
      let fakeData = {
        data: {
          data: { data: newQuestionDataList },
        },
        status: 200,
      };
      dispatch(
        responseHandler(
          fakeData,
          callbackSuccess,
          callbackError,
          true,
          successGetQuestionList,
          failureGetQuestionList
        )
      );
    }
  };
}
