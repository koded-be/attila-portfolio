import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The CMS path is deliberately not listed: a Disallow line would reveal it
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
