import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db
    .select({ id: projects.id, createdAt: projects.createdAt })
    .from(projects);

  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/projects`, priority: 0.8 },
    ...rows.map((p) => ({
      url: `${SITE_URL}/projects/${p.id}`,
      lastModified: p.createdAt,
      priority: 0.6,
    })),
  ];
}
