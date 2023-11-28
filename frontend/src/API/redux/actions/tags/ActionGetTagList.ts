import api from "@/API/api";
import { CommonParams } from "@/API/type/params/Common.params";
import { responseHandler } from "../ResponseHandler";
import { requesting } from "../../reducers/GlobalSlice";

export default function actionGetTagList(
  form: CommonParams,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getTags(form).then((res: any) => {
      console.log("actionGetTagList:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
