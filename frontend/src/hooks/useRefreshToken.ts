"use client";

import axios from "@/API/api/axios";
import { url } from "@/API/api/url";
import { signIn, useSession } from "next-auth/react";
export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post(url.REFRESH_TOKEN, {
      refreshToken: session?.user.refreshToken,
    });

    if (session) {
      session.user.accessToken = res.data.accessToken;
      session.user.refreshToken = res.data.refreshToken;
      session.user.expires_in = res.data.expires_in;
    } else signIn();
  };
  return refreshToken;
};
