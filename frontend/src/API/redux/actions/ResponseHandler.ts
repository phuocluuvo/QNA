import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { resetAll } from "../reducers/RootReducer";

export function responseHandler(
  res: {
    status: number;
    data: {
      message?: string;
      data?: any;
      result_code?: string;
    };
  },
  callbackSuccess: (...props: any) => void,
  callbackError: (...props: any) => void,
  isSaveReducer: boolean,
  successReducer: any,
  failReducer: any
): any {
  //   Languages = LanguagesUtils.getCurrentLanguage();
  return (dispatch: Dispatch<AnyAction>): any => {
    if (res.status === 200 || res.status === 201) {
      //Please don't change anything in this file
      return dispatch(
        successCb(res.data.data, callbackSuccess, isSaveReducer, successReducer)
      );
    } else if (res.status === 401) {
      //   eventListener.logOutEvent();
      return dispatch(resetAll());
    }
    if (res.status === null) {
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
      let resultCode = "";
      if (res.data.result_code != null) {
        resultCode = res.data.result_code;
      }
      if (res.data.message != null) {
        messageApi = res.data.message;
      }
      return dispatch(
        failCb(
          getMessageFromStatusCode(res.status),
          callbackError,
          isSaveReducer,
          failReducer,
          messageApi,
          res.data.data,
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
  resultCode?: string
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
