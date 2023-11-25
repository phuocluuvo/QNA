import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { requesting } from "../../reducers/GlobalSlice";
import api from "@/API/api";
import { responseHandler } from "../ResponseHandler";

export default function actionGetAllAnnouncements(
  callbackSuccess: (response: any) => void,
  callbackError: (error: any) => void
) {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(requesting());
    api.getAnouncements().then((res: any) => {
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}
