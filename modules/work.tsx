import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

async function ProjectsData() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase.from("projects").select();

  if (error) {
    console.error(error);
    return null;
  }

  console.log(projects);

  return projects?.map((project) => (
    <div
      key={project.id}
      className="flex flex-col items-center justify-center gap-4"
    >
      <h2 className="text-3xl text-white">{project.title}</h2>
      <p className="text-gray-400">{project.text}</p>
    </div>
  ));
}

export const Work = () => {
  return (
    <section id="work" className="flex h-screen items-center p-20">
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsData />
      </Suspense>
    </section>
  );
};
