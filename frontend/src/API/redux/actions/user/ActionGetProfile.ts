import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";

export default function actionGetProfile(
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getUserDashBoard().then((res: any) => {
      console.log("getDashBoard:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}

export function actionGetUserDashBoardById(
  id: string,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getUserDashBoardById(id).then((res: any) => {
      console.log("getDashBoard:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
