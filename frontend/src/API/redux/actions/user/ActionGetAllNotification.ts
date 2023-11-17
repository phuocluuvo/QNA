import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";
import { CommonParams } from "@/API/type/params/Common.params";
import {
  failureGetNotificationList,
  successGetNotificationList,
} from "../../reducers/NotificationSlice";

export function ActionGetAllNotification(
  params: CommonParams,
  callbackSuccess: (res: any) => void,
  callbackError: (err: any) => void
) {
  return function (dispatch: any) {
    dispatch(requesting());
    api.getAllNotification(params).then(function (res) {
      console.log("getAllNotification:", res);
      dispatch(
        responseHandler(
          res,
          callbackSuccess,
          callbackError,
          true,
          successGetNotificationList,
          failureGetNotificationList
        )
      );
    });
  };
}
