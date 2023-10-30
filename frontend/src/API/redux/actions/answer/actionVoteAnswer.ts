import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";
import { FormVoteAnswer } from "@/API/type/Form.type";

export default function actionVoteAnswer(
  form: FormVoteAnswer,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.voteAnswer(form).then((res: any) => {
      console.log("voteAnswer:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
