import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:shortCode",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:shortCode`,
      },
    ];
  },
};

export default nextConfig;