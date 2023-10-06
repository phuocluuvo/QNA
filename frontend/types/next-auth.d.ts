import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      email: string;
      avatar: string;
      refreshToken: JWT;
      accessToken: JWT;
    };
  }
}
