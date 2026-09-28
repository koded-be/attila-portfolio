import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { ProjectCard } from "./project-card";
import { Button } from "../_common/button";

export const Work = async () => {
  const workProjects = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.createdAt))
    .limit(6);

  return (
    <section
      id="work"
      className="mx-auto flex flex-col w-full p-20 max-w-600 gap-20"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-5xl text-primary">My recent works</h2>
          <Button href="/projects">View all projects</Button>
        </div>
        <p className="text-lg text-white">
          Here are some of my recent projects. Click on a project to see more
          details.
        </p>
      </div>
      <div className="relative flex flex-col gap-[40vh]">
        {workProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};
