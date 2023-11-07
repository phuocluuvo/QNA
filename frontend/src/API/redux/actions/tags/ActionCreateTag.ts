import { FormCreateTag } from "@/API/type/Form.type";
import { requesting } from "../../reducers/GlobalSlice";
import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";

export default function actionCreateTag(
  form: FormCreateTag,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.createTag(form).then((res: any) => {
      console.log("createTag:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
