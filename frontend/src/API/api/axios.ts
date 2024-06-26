import axios, { AxiosError } from "axios";
import { url } from "./url";
import { getSession, signIn, signOut } from "next-auth/react";
import _ from "lodash";
import { STATUS } from "../constant/StatusCode.enum";
const BASE_URL = "https://trongphan5301.click";
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
    sessionStorage.clear();
    signOut().then(
      () => {
        toast.success("Sign out successfully");
        signIn();
      },
      () => {}
    );
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
      if (
        !error.response?.config.url?.startsWith(
          "https://trongphan5301.click/api/notification/badgeNumber"
        )
      )
        toast.error(
          // @ts-ignore
          getErrorMessageFromCodeString(error.response.data?.message)
        );
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

function getErrorMessageFromCodeString(
  code: string,
  isHaveLoggedIn: boolean
): string {
  if (code === "NOT_VOTE_MY_SELF")
    return "You cannot vote for your question/answer";
  if (code === "Unauthorized")
    if (isHaveLoggedIn) return "Your session is over. Please login again";
    else return "You are not logged in. Please login to continue";
  if (code === "PASSWORD_IS_NOT_CORRECT") return "Password is not correct";
  if (code === "TAG_ALREADY_EXISTS")
    return "Tag already exists, please check your tag";
  if (code === "USER_NOT_FOUND") return "User not found. Please checkF again";
  return code;
}
