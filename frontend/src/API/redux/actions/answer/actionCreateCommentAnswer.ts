import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";
import { FormCommentAnswer } from "@/API/type/Form.type";

export default function actionCreateCommentAnswer(
  form: FormCommentAnswer,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
) {
  return (dispatch: any) => {
    dispatch(requesting());
    api.createCommentAnswer(form).then((res: any) => {
      console.log("createCommentAnswer:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
