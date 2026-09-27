import { desc } from "drizzle-orm";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { CMS_PATH } from "@/lib/site";
import { projectImageStorage } from "@/lib/storage/project-image-storage";
import { DeleteButton } from "@/modules/cms/delete-button";
import { deleteProject, logout, replaceResume } from "./actions";

const RESUME_MESSAGES: Record<string, string> = {
  ok: "Resume replaced.",
  invalid: "Please choose a PDF file.",
  "too-big": "PDF must be under 4.4 MB.",
};

export default async function CmsPage({
  searchParams,
}: PageProps<"/studio-a3145d39">) {
  await requireAdmin();
  const { resume } = await searchParams;
  const rows = await db
    .select({
      id: projects.id,
      title: projects.title,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl">Studio</h1>
        <form action={logout}>
          <button className="text-sm text-gray underline">Log out</button>
        </form>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Projects</h2>
          <Link
            href={`${CMS_PATH}/projects/new`}
            className="rounded-lg bg-primary px-4 py-2 text-black"
          >
            New project
          </Link>
        </div>
        <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
          {rows.map((p) => (
            <li key={p.id} className="flex items-center gap-4 px-4 py-3">
              <span className="flex-1 truncate">{p.title || "Untitled"}</span>
              <span className="text-sm text-gray">
                {p.createdAt.toLocaleDateString("en-GB")}
              </span>
              <Link
                href={`/projects/${p.id}`}
                target="_blank"
                className="text-sm underline"
              >
                View
              </Link>
              <Link
                href={`${CMS_PATH}/projects/${p.id}`}
                className="text-sm text-primary underline"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteProject.bind(null, p.id)}
                confirmText={`Delete "${p.title || "Untitled"}" and all its images?`}
              />
            </li>
          ))}
          {rows.length === 0 && (
            <li className="px-4 py-3 text-gray">No projects yet.</li>
          )}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Resume</h2>
        <form
          action={replaceResume}
          className="flex flex-wrap items-center gap-4"
        >
          <input type="file" name="file" accept="application/pdf" required />
          <button className="rounded-lg bg-primary px-4 py-2 text-black">
            Replace resume
          </button>
          <a
            href={projectImageStorage.getResumeUrl()}
            target="_blank"
            className="text-sm underline"
          >
            View current
          </a>
        </form>
        {typeof resume === "string" && RESUME_MESSAGES[resume] && (
          <p className="text-sm text-primary">{RESUME_MESSAGES[resume]}</p>
        )}
      </section>
    </>
  );
}
