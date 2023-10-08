import axios from "axios";
import { url } from "./url";
import { getSession } from "next-auth/react";
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
  const res = await axios.post(BASE_URL + url.REFRESH_TOKEN, {
    refreshToken: refreshToken,
  }, {
    headers: { "Content-Type": "application/json" },
  });
  const data = res.data;
  console.log("newRefreshToken:", { data });  

  return data;
}
export async function AuthApi(
  method: "GET" | "POST" | "DELETE" | "UPDATE",
  url: string,
  data = {}
) {
  const session = await getSession();
  console.log("before: ", session?.user.accessToken);

  const config = {
    method: method,
    url: BASE_URL + url,
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
      "Content-Type": "application/json",
    },
    ...(method === "GET" ? {} : { data: JSON.stringify(data) }),
  };

  let res = await axios(config);

  if (res.status == 401) {
    if (session) {
      await refreshToken(session?.user.refreshToken ?? "").then((data) => {
        session.user.accessToken = data.accessToken;
        session.user.refreshToken = data.refreshToken;
        session.user.expires_in = data.expires_in;
      });
    }
    console.log("after: ", session?.user.accessToken);

    config.headers.Authorization = `Bearer ${session?.user.accessToken}`;
    res = await axios(config);

    return res;
  }

  return res;
}