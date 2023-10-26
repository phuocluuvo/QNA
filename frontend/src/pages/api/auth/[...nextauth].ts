import NextAuth, { AuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import api from "@/API/api";

export const authOptions: AuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignoref
      async authorize(credentials, req) {
        const form = {
          username: credentials?.username as string,
          password: credentials?.password as string,
        };
        const user = await api.requestSignIn(form);
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
  },
};

export default NextAuth(authOptions);
