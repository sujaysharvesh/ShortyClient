// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:shortCode",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:shortCode`,
        // Add this to handle missing URLs
        has: [
          {
            type: 'header',
            key: 'x-nextjs-rewrite-attempt',
          },
        ],
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-robots-tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;