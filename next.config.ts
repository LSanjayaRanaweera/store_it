import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "nyc.cloud.appwrite.io", // updated from cloud.appwrite.io to nyc.cloud.appwrite.io  << Eliminated the error occurred with uploading images
      },
    ],
  },
};

export default nextConfig;
// GO OVER why we need these configurations? to overcome what?
