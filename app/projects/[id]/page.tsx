import type { Metadata } from "next";
import { getProject } from "@/lib/db/projects";
import { projectImageStorage } from "@/lib/storage/project-image-storage";
import { Navbar } from "@/modules/_common/navbar/navbar";
import { ProjectDetail } from "@/modules/project-detail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Project not found" };

  const title = project.title ?? "Project";
  const text = project.text?.replace(/\s+/g, " ").trim();
  const description =
    text && text.length > 160 ? `${text.slice(0, 157)}…` : text || undefined;
  const image = project.heroImage ?? project.images?.[0];
  const url = `/projects/${project.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: image
        ? [projectImageStorage.getProjectImageUrl(project.id, image)]
        : ["/hero-background.png"],
    },
  };
}

export default async function Page({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;

  return (
    <>
      <Navbar defaultActiveSection="work" defaultScrolled={true} />
      <ProjectDetail id={id} />
    </>
  );
}
