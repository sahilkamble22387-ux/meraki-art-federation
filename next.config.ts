import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/thevertmenthe",
        destination: "/",
        permanent: true,
      },
      {
        source: "/thevertmenthe/gallery",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/thevertmenthe/gallery/:slug*",
        destination: "/gallery/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
