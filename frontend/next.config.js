/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();
const nextConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
  },
  images: {
    domains: [
      "picsum.photos",
      "https://i.pravatar.cc",
      "https://res.cloudinary.com/",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  experimental: {
    serverActions: true,
    appDir: false,
  },
};
module.exports = removeImports(nextConfig);
