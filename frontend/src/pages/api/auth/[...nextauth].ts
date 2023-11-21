import NextAuth, { AuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import api from "@/API/api";
import axios from "@/API/api/axios";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (credentials?.token) {
          console.log("credentials__:", credentials);
          const user = await axios.post("/api/auth/refresh-v2", {
            refreshToken: credentials?.token,
          });

          console.log("user__:", user);
          if (!user) return null;
          return user.data;
        }

        const form = {
          username: credentials?.username as string,
          password: credentials?.password as string,
        };
        const user = await api.requestSignIn(form);
        if (!user) return null;
        return user.data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("jwt__:", token, user);
      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      console.log("old_session__:", session);
      console.log("token__:", token);
      session.user = token as any;
      console.log("new_session__:", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (
        url.startsWith("http") ||
        url.startsWith("https") ||
        url.startsWith("//")
      )
        return url;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

export default NextAuth(authOptions);
