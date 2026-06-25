"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project, ProjectCard } from "./project-card";
import { Button } from "../_common/button";
import Link from "next/link";

export const Work = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select()
        .range(0, 5)
        .order("created_at", { ascending: true });

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
      className="mx-auto flex flex-col w-full max-w-7xl gap-20"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-5xl text-primary">My recent works</h2>
          <Link href="/projects">
            <Button>View all projects</Button>
          </Link>
        </div>
        <p className="text-lg text-white">
          Here are some of my recent projects. Click on a project to see more
          details.
        </p>
      </div>
      <div className="relative flex flex-col gap-[40vh]">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};
