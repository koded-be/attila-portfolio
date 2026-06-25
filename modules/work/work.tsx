"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project, ProjectCard } from "./project-card";

export const Work = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("projects").select();

      if (error) {
        console.error(error);
        return;
      }

      setProjects(data ?? []);
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="work"
      className="relative mx-auto flex w-full max-w-7xl flex-col gap-[40vh]"
    >
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </section>
  );
};
