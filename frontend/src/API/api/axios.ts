import axios from "axios";
import { url } from "./url";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
const BASE_URL = "http://localhost:3001";
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
async function refreshToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expires_in: Date;
}> {
  const res = await fetch(BASE_URL + url.REFRESH_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });
  const data = await res.json();
  console.log("newRefreshToken:", { data });

  return data;
}
export async function AuthApi(
  method: "GET" | "POST" | "DELETE" | "UPDATE",
  url: string,
  data = null
) {
  const session = await getSession();
  console.log("before: ", session?.user.accessToken);

  const config = {
    method: method,
    url: BASE_URL + url,
    headers: {
      Authorization: `bearer ${session?.user.accessToken}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
    data: method === "GET" ? null : JSON.stringify(data),
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.error(error);
    // @ts-ignore
    if (error.response && (error.response.status == 401 || error.response.status == 400)) {
      if (session) {
        let data = await refreshToken(session?.user.refreshToken ?? "");
        if (data) {
          session.user.accessToken = data.accessToken;
          session.user.refreshToken = data.refreshToken;
          session.user.expires_in = data.expires_in;
        }
      }
      console.log("after: ", session?.user.accessToken);

      config.headers.Authorization = `bearer ${session?.user.accessToken}`;
      let res = await axios(config);

      return res;
    } else {
      signIn();
      // throw error;
    }
  }
}
