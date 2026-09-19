import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

type ProjectDetailProps = {
  id: string;
};

export const ProjectDetail = async ({ id }: ProjectDetailProps) => {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) {
    return <></>;
  }

  return <></>;
};
