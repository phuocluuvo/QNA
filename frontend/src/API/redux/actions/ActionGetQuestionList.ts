import {
  failureGetQuestionList,
  requestGetQuestionList,
  successGetQuestionList,
} from "../reducers/QuestionSlice";
import { FormQuestion } from "@/API/type/Form.type";
import { responseHandler } from "./ResponseHandler";
import { finishedRequest, requesting } from "../reducers/GlobalSlice";
import questionDataList from "@/util/mock/QuestionDataList.mock";
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
      let fakeData = {
        data: {
          data: questionDataList,
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
