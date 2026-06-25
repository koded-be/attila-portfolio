import Image from "next/image";
import Link from "next/link";
import { Button } from "../_common/button";
import { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { ProjectImageStorage } from "../_common/project-image-storage";

export type Project = {
  id: string;
  title: string | null;
  text: string | null;
  images: Json;
  created_at: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const supabase = createClient();
  const imageStorage = new ProjectImageStorage(supabase);

  const fileNames = (project.images as string[]) ?? [];
  const [mainFileName, ...restFileNames] = fileNames;

  const mainImage = mainFileName
    ? imageStorage.getProjectImageUrl(project.id, mainFileName)
    : null;

  const restImages = restFileNames.slice(0, 2).map((fileName) => ({
    fileName,
    url: imageStorage.getProjectImageUrl(project.id, fileName),
  }));

  return (
    <div
      className="sticky w-full"
      style={{
        top: `${20 + index * 4}vh`,
        zIndex: index + 1,
      }}
    >
      <div className="w-full rounded-3xl border border-white/10 bg-[#0c1118] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 shrink-0 rounded-full bg-white/80" />
            <h2 className="text-lg font-medium text-white">{project.title}</h2>
          </div>

          <Link href={`/projects/${project.id}`}>
            <Button>See project</Button>
          </Link>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-3 gap-4">
          {mainImage ? (
            <div className="relative col-span-2 aspect-16/10 overflow-hidden rounded-2xl bg-white/5">
              <Image
                src={mainImage}
                alt={project.title || "Project image"}
                fill
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="col-span-2 aspect-16/10 rounded-2xl bg-white/5" />
          )}

          <div className="col-span-1 grid grid-rows-2 gap-4">
            {restImages.map(({ fileName, url }, i) =>
              url ? (
                <div
                  key={fileName}
                  className="relative aspect-16/10 overflow-hidden rounded-2xl bg-white/5"
                >
                  <Image
                    src={url}
                    alt={`${project.title} preview ${i + 2}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
