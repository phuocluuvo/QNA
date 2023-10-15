import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      fullname: string;
      avatar: string;
      dob: string;
      email: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      accessToken: string;
      refreshToken: string;
      expires_in: Date;
    };
  }
}
