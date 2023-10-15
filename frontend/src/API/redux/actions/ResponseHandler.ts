import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { resetAll } from "../reducers/RootReducer";

export function responseHandler(
  res: any,
  callbackSuccess: (...props: any) => void,
  callbackError: (...props: any) => void,
  isSaveReducer: boolean,
  successReducer: any,
  failReducer: any,
): any {
  //   Languages = LanguagesUtils.getCurrentLanguage();
  return (dispatch: Dispatch<AnyAction>): any => {
    if (res.status === 200 || res.status === 201) {
      //Please don't change anything in this file
      return dispatch(
        successCb(res.data, callbackSuccess, isSaveReducer, successReducer)
      );
    } else if (res.status === 401) {
      //   eventListener.logOutEvent();
      return dispatch(resetAll());
    }
    if (res.status === null || res.ok === false) {
      //Please don't change anything in this file
      return dispatch(
        failCb(
          "Languages.TEXT_API_NETWORK_ERROR",
          callbackError,
          isSaveReducer,
          failReducer
        )
      );
    } else {
      let messageApi = "";
      let resultCode = 0;
      if (res.status != null) {
        resultCode = res.status;
      }
      if (res.statusText != null) {
        messageApi = res.statusText;
      }
      return dispatch(
        failCb(
          getMessageFromStatusCode(res.status),
          callbackError,
          isSaveReducer,
          failReducer,
          messageApi,
          res.data,
          res.status,
          resultCode
        )
      );
    }
  };
}
export function successCb(
  data: any,
  callbackSuccess: (...props: any) => void,
  isSaveReducer: boolean,
  successReducer: any
) {
  if (callbackSuccess) {
    callbackSuccess(data);
  }
  if (isSaveReducer) {
    return successReducer(data);
  }
  return { type: "Successnone" };
}

export function failCb(
  message?: string,
  callbackError?: (...props: any) => void,
  isSaveReducer?: boolean,
  failReducer?: any,
  messageApi?: string,
  data?: any,
  statusCode?: number,
  resultCode?: number
) {
  if (!messageApi) {
    messageApi = "";
  }
  if (!statusCode) {
    statusCode = 599;
  }
  if (callbackError) {
    callbackError(message, messageApi, data, statusCode, resultCode);
  }
  if (isSaveReducer) {
    return failReducer({ message, messageApi, statusCode, resultCode });
  }
  return { type: "Failnone" };
}
const getMessageFromStatusCode = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return "Not found";
  }
};
