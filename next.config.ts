import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  async redirects() {
    if (process.env.ADMIN_ONLY_MODE === "true") {
      return [
        {
          source: "/",
          destination: "/admin",
          permanent: false,
        },
      ];
    }
    return [];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;