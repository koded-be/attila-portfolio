import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from ".";
import { projects } from "./schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cached per request so generateMetadata and the page share one query
export const getProject = cache(async (id: string) => {
  if (!UUID.test(id)) return null;
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return project ?? null;
});
