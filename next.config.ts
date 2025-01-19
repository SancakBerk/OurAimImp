import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: undefined,
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
