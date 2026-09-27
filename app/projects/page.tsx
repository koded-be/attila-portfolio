import type { Metadata } from "next";
import { Navbar } from "@/modules/_common/navbar/navbar";
import { Projects } from "@/modules/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse all 3D projects by Attila Tolnai: scenes, renders, texturing and UV mapping made in Blender.",
  alternates: { canonical: "/projects" },
};

export default async function Page({ searchParams }: PageProps<"/projects">) {
  const { q, sort } = await searchParams;

  return (
    <>
      <Navbar defaultActiveSection="work" defaultScrolled={true} />
      <Projects
        q={typeof q === "string" ? q.trim() : ""}
        sort={sort === "oldest" ? "oldest" : "newest"}
      />
    </>
  );
}
