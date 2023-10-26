import { FormVote } from "@/API/type/Form.type";
import { requesting } from "../../reducers/GlobalSlice";
import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";

export default function actionVoteQuestion(
  form: FormVote,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.voteQuestion(form).then((res: any) => {
      console.log("voteQuestion:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
