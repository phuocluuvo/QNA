import axios, { AxiosError } from "axios";
import { url } from "./url";
import { getSession, signIn } from "next-auth/react";
import _ from "lodash";
import { STATUS } from "../constant/StatusCode.enum";
const BASE_URL = "http://trongphan5301.click";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const apiFormData = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});
export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});
export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});
async function refreshToken(
  refreshToken: string,
  accessToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expires_in: Date;
}> {
  console.log("refreshToken:", { refreshToken, accessToken });
  const res = await fetch(BASE_URL + url.REFRESH_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });
  const data = await res.json();
  if (
    data.statusCode === STATUS.UNAUTHORIZED ||
    data.statusCode === STATUS.BAD_REQUEST ||
    data.statusCode === STATUS.ACCESS_DENIED
  ) {
    sessionStorage.removeItem("next-auth.session-token");

    signIn();
  } else {
    console.log("refreshToken:", data);
  }
  return data;
}
export async function AuthApi(
  method: "GET" | "POST" | "DELETE" | "UPDATE" | "PATCH",
  url: string,
  data: any = null
) {
  const sessionData =
    sessionStorage.getItem("next-auth.session-token")?.toString() ?? null;
  let sessionUser = null;
  if (sessionData != "undefined" && sessionData) {
    sessionUser = JSON.parse(sessionData);
  } else {
    let _s = await getSession();
    sessionUser = _s?.user;
    sessionStorage.setItem(
      "next-auth.session-token",
      JSON.stringify(sessionUser)
    );
  }
  console.log("before: ", sessionUser?.accessToken);

  const config = {
    method: method,
    url: BASE_URL + url,
    headers: {
      Authorization: `bearer ${sessionUser?.accessToken}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
    data: method === "GET" ? null : JSON.stringify(data),
  };

  try {
    let res = await axios(config);
    return res;
  } catch (err: unknown) {
    const error = err as AxiosError;
    if (
      error.response &&
      (error.response.status == STATUS.UNAUTHORIZED ||
        error.response.status == STATUS.BAD_REQUEST)
    ) {
      // @ts-ignore
      toast.error(getErrorMessageFromCodeString(error.response.data?.message));
      console.log("error.response.status", error.response.status);
      console.log("error.response.data", error.response);
      if (sessionUser) {
        let data = await refreshToken(
          sessionUser?.refreshToken ?? "",
          sessionUser?.accessToken ?? ""
        );
        if (data.accessToken && data.refreshToken) {
          sessionUser.accessToken = data.accessToken;
          sessionUser.refreshToken = data.refreshToken;
          sessionUser.expires_in = data.expires_in;
          console.log("newSession:", sessionUser);
          sessionStorage.setItem(
            "next-auth.session-token",
            JSON.stringify(sessionUser)
          );
        }
      }
      console.log("after: ", sessionUser?.accessToken);

      config.headers.Authorization = `bearer ${sessionUser?.accessToken}`;
      let res = await axios(config);

      return res;
    }
  }
}

function getErrorMessageFromCodeString(code: string) {
  if (code === "NOT_VOTE_MY_SELF")
    return "You cannot vote for your question/answer";
  if (code === "Unauthorized")
    return "You need to be logged in to perform this action";
  return code;
}
