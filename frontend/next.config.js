/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    defaultLocale: "vi",
    locales: ["en", "vi"],
  },
  images: {
    domains: ["picsum.photos", "https://i.pravatar.cc"],
  },
};

module.exports = nextConfig;
