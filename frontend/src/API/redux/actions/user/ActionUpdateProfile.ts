import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";
import { FormUpdateProfile } from "@/API/type/Form.type";
import { requesting } from "../../reducers/GlobalSlice";

export default function ActionUpdateProfile(
  form: FormUpdateProfile,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.updateProfile(form).then((res: any) => {
      console.log("get actionUpdateProfile:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
