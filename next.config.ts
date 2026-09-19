import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL(`${process.env.NEON_STORAGE_PUBLIC_URL}/**`)],
  },
};

export default nextConfig;
