import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getProject } from "@/lib/db/projects";
import { projectImageStorage } from "@/lib/storage/project-image-storage";
import { ProjectForm } from "@/modules/cms/project-form";

export default async function EditProjectPage({
  params,
}: PageProps<"/studio-a3145d39/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;

  // "new" gets a fresh id; the row is only inserted on first save
  const project = id === "new" ? null : await getProject(id);
  if (id !== "new" && !project) notFound();
  const projectId = project?.id ?? crypto.randomUUID();

  return (
    <ProjectForm
      id={projectId}
      isNew={!project}
      imageBase={projectImageStorage.getProjectImageUrl(projectId, "")}
      initial={{
        title: project?.title ?? "",
        text: project?.text ?? "",
        software: project?.software ?? "",
        projectType: project?.projectType ?? "",
        heroImage: project?.heroImage ?? "",
        images: project?.images ?? [],
        scenes: project?.scenes ?? [],
        texturing: project?.texturing ?? {
          text: "",
          paletteImage: "",
          uvImages: [],
        },
      }}
    />
  );
}
