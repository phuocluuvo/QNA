import {
  failureCreateQuestion,
  requestCreateQuestion,
  successCreateQuestion,
} from "../../reducers/QuestionSlice";
import { FormCreateQuestion } from "@/API/type/Form.type";
import { responseHandler } from "../ResponseHandler";
import { finishedRequest, requesting } from "../../reducers/GlobalSlice";
import questionDataList from "@/util/mock/QuestionDataList.mock";
import { PostType } from "@/util/type/Post.type";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import api from "@/API/api";

export default function actionCreateQuestion(
  form: FormCreateQuestion,
  callbackSuccess: (res: { data: PostType }) => void,
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
    dispatch(finishedRequest());
    // if (questionDataList) {
    //   let checkData = null;
    //   let fakeData = {
    //     title: form.title,
    //     content: form.content,
    //   };
    //   if (fakeData) {
    //     let newQuestion: PostType = {
    //       ...fakeData,
    //       id: questionDataList.postList.length + 1,
    //       createdDate: new Date().toISOString(),
    //       updatedDate: new Date().toISOString(),
    //       answerList: {
    //         answerList: [],
    //         pagination: {
    //           currentPage: 1,
    //           totalPageNumber: 1,
    //         },
    //       },
    //       voteNumber: 0,
    //       answerNumber: 0,
    //       viewsNumber: 0,
    //     };
    //     questionDataList.postList.push(newQuestion);
    //     checkData = questionDataList.postList.find(
    //       (item: PostType) => item.id === newQuestion.id
    //     );
    //     console.log("checkData:", checkData);
    //     if (checkData) {
    //       let fakeData = {
    //         data: {
    //           data: { data: checkData },
    //         },
    //         status: 200,
    //       };
    //       dispatch(
    //         responseHandler(
    //           fakeData,
    //           callbackSuccess,
    //           callbackError,
    //           true,
    //           successCreateQuestion,
    //           failureCreateQuestion
    //         )
    //       );
    //     }
    //   }
    // }
  };
}
