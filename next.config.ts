import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://app.gohighlevel.com https://*.msgsndr.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
