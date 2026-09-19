import { Navbar } from "@/modules/_common/navbar/navbar";
import { ProjectDetail } from "@/modules/project-detail";

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;

  return (
    <>
      <Navbar defaultActiveSection="work" defaultScrolled={true} />
      <ProjectDetail id={id} />
    </>
  );
}
