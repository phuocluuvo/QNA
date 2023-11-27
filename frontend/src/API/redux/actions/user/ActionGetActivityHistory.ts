import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";
import { CommonParams } from "@/API/type/params/Common.params";

export function ActionGetUserHistory(
  params: CommonParams,
  callbackSuccess: (res: any) => void,
  callbackError: (err: any) => void
) {
  return function (dispatch: any) {
    dispatch(requesting());
    api.getActivityHistory(params).then(function (res) {
      console.log("getActivityHistory:", res);
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
