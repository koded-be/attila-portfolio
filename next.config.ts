import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        "https://zpmjubsijfywaodjtpid.supabase.co/storage/v1/object/public/project_images/**",
      ),
    ],
  },
};

export default nextConfig;
