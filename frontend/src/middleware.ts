export { default } from "next-auth/middleware";

export const config = {
  // protected routes that need authentication
  matcher: [
    "/user/notification",
    "/en/user/notification",
    "/user/profile",
    "/en/user/profile",
  ],
};
