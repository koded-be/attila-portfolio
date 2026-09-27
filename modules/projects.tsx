import { asc, desc, ilike, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { projectImageStorage } from "@/lib/storage/project-image-storage";
import { ProjectsFilters } from "./projects-filters";

type ProjectsProps = {
  q: string;
  sort: "newest" | "oldest";
};

export const Projects = async ({ q, sort }: ProjectsProps) => {
  const allProjects = await db
    .select()
    .from(projects)
    .where(
      q
        ? or(ilike(projects.title, `%${q}%`), ilike(projects.text, `%${q}%`))
        : undefined,
    )
    .orderBy(
      sort === "oldest" ? asc(projects.createdAt) : desc(projects.createdAt),
    );

  return (
    <section className="mx-auto flex flex-col w-full p-20 pt-40 max-w-600 gap-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl text-primary">All projects</h1>
        <p className="text-lg text-white">
          Browse everything I&apos;ve made. Click on a project to see more
          details.
        </p>
      </div>

      <ProjectsFilters q={q} sort={sort} />

      {allProjects.length === 0 ? (
        <p className="text-lg text-gray">
          {q ? `No projects match "${q}".` : "No projects yet."}
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project, i) => {
            const [mainFileName] = project.images ?? [];

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#0c1118] p-6 shadow-2xl transition duration-200 hover:border-primary/50"
              >
                <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-white/5">
                  {mainFileName && (
                    <Image
                      src={projectImageStorage.getProjectImageUrl(
                        project.id,
                        mainFileName,
                      )}
                      alt={project.title || "Project image"}
                      fill
                      loading={i < 3 ? "eager" : undefined}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1 shrink-0 rounded-full bg-white/80" />
                  <h2 className="text-lg font-medium text-white">
                    {project.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};
