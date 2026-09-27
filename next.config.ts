import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";
import { CMS_PATH } from "./lib/site";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${process.env.NEON_STORAGE_PUBLIC_URL}/**`)],
  },
  // CMS uploads one file per action; Vercel caps request bodies at 4.5 MB anyway
  experimental: {
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  async headers() {
    return [
      {
        source: `${CMS_PATH}/:path*`,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: CMS_PATH,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withBotId(nextConfig);
