const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
initOpenNextCloudflareForDev();
/** @type {import('next').NextConfig} */
const nextConfig = {
  // weflow Base Path
  basePath: "/app",
  assetPrefix: "/app",
  // output: "standalone",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
