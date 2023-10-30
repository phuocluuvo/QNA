import api from "@/API/api";
import { FormGetAnswer } from "@/API/type/Form.type";
import { responseHandler } from "../ResponseHandler";
import { requesting } from "../../reducers/GlobalSlice";
import { AnswerListType } from "@/util/type/Answer.type";
import {
  failureGetAnswerList,
  requestGetAnswerList,
  sucessGetAnswerList,
} from "../../reducers/AnswerSlice";

export default function actionGetAnswer(
  form: FormGetAnswer,
  callbackSuccess: (res: AnswerListType) => void,
  callbackError: () => void
) {
  return (dispatch: any) => {
    dispatch(requesting());
    dispatch(requestGetAnswerList());
    api.getAnswerList(form).then((res: any) => {
      console.log("getAnswerList:", res);
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          true,
          sucessGetAnswerList,
          failureGetAnswerList
        )
      );
    });
  };
}
