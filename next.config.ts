// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "puppeteer-core",
        "@sparticuz/chromium",
      ];
    }
    return config;
  },
};

export default nextConfig;
