import Api from "@/API/api";
import {
  failureGetQuestion,
  requestGetQuestion,
  successGetQuestion,
} from "../reducers/QuestionSlice";
import { FormQuestion } from "@/API/type/Form.type";
import { responseHandler } from "./ResponseHandler";
import { finishedRequest, requesting } from "../reducers/GlobalSlice";
import questionDataList from "@/util/mock/QuestionDataList.mock";
import { PostType } from "@/util/type/Post.type";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

export default function actionGetQuestion(
  form: FormQuestion,
  callbackSuccess: (res: PostType) => void,
  callbackError: () => void
): any {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    dispatch(requestGetQuestion());
    // Api.getQuestion(form).then((res: any) => {
    //   console.log("getQuestion:", res);
    //   dispatch(successGetQuestion(res.data));
    //   dispatch(
    //     responseHandler(
    //       res,
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
      let data = questionDataList.postList.find(
        (item: PostType) => item.id === form.id
      );
      console.log("data:", data);
      if (data) {
        let fakeData = {
          data: {
            data: data,
          },
          status: 200,
        };
        dispatch(
          responseHandler(
            fakeData,
            callbackSuccess,
            callbackError,
            true,
            successGetQuestion,
            failureGetQuestion
          )
        );
      }
    }
  };
}
