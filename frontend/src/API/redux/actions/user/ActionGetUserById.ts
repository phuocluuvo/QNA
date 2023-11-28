import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";
import { requesting } from "../../reducers/GlobalSlice";

export function actionGetUserById(
  /**
   * id of the user
   */
  userId: string,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getUserById(userId).then((res: any) => {
      console.log("getUserById:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
