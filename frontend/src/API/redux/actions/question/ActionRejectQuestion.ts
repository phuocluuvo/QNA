import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";

export default function actionBlockQuestion(
  /**
   * id of the question
   */
  questionId: string,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.blockQuestion(questionId).then((res: any) => {
      console.log("blockQuestion:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
