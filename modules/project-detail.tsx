import { asc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { projectImageStorage } from "@/lib/storage/project-image-storage";
import { ImageCompare } from "./_common/image-compare";

type ProjectDetailProps = {
  id: string;
};

const Icon = ({
  children,
  className = "size-5 shrink-0 text-primary",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

const CubeIcon = () => (
  <Icon>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </Icon>
);

const TriangleIcon = () => (
  <Icon>
    <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
  </Icon>
);

const ArrowLeftIcon = () => (
  <Icon>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </Icon>
);

const ArrowRightIcon = () => (
  <Icon>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Icon>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sm uppercase tracking-widest text-primary">
    {children}
  </span>
);

const formatCount = (n: number) => n.toLocaleString("en-US");

export const ProjectDetail = async ({ id }: ProjectDetailProps) => {
  // ponytail: loads every id for prev/next; fine for a portfolio-sized table.
  // Also rejects non-uuid ids before they reach the uuid column.
  const orderedIds = await db
    .select({ id: projects.id })
    .from(projects)
    .orderBy(asc(projects.createdAt));
  const index = orderedIds.findIndex((p) => p.id === id);

  if (index === -1) {
    notFound();
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  const imageUrl = (fileName: string) =>
    projectImageStorage.getProjectImageUrl(project.id, fileName);

  const previousId = orderedIds[index - 1]?.id;
  const nextId = orderedIds[index + 1]?.id;
  const scenes = project.scenes ?? [];
  const { texturing } = project;

  const meta = [
    {
      label: "Software",
      value: project.software,
      icon: (
        <Icon className="size-6 shrink-0 text-primary">
          <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
          <path d="M7 3v4a1 1 0 0 0 1 1h7" />
        </Icon>
      ),
    },
    {
      label: "Project type",
      value: project.projectType,
      icon: (
        <Icon className="size-6 shrink-0 text-primary">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </Icon>
      ),
    },
  ].filter((item) => item.value);

  return (
    <section className="mx-auto flex w-full max-w-600 flex-col wrap-anywhere gap-16 px-6 pt-32 pb-20 md:px-20 md:pt-40">
      {/* Hero */}
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-8">
          <Link
            href="/projects"
            className="flex w-fit items-center gap-3 text-white transition-colors hover:text-primary"
          >
            <ArrowLeftIcon />
            Back to all projects
          </Link>

          <div className="flex flex-col gap-2">
            <Label>Project</Label>
            <h1
              title={project.title ?? undefined}
              className="truncate text-4xl leading-tight text-white md:text-5xl"
            >
              {project.title}
            </h1>
          </div>

          {project.text && (
            <div className="flex flex-col gap-2">
              <Label>Why?</Label>
              <p className="max-w-160 leading-relaxed whitespace-pre-line text-white/80">
                {project.text}
              </p>
            </div>
          )}

          {meta.length > 0 && (
            <ul className="flex flex-col gap-5">
              {meta.map(({ label, value, icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-5 tracking-wider text-white"
                >
                  {icon}
                  <span className="truncate">{label}: {value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {project.heroImage && (
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl(project.heroImage)}
              alt={project.title || "Project image"}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Scenes */}
      {scenes.length > 0 && (
        <div className="flex flex-col gap-4">
          <Label>Scenes</Label>
          {scenes.map((scene, i) => (
            <article
              key={scene.title}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0c1118] md:flex-row"
            >
              <div className="flex min-w-0 flex-col justify-between gap-10 p-8 md:flex-1 md:p-12">
                <div className="flex flex-col gap-4">
                  <Label>Scene {String(i + 1).padStart(2, "0")}</Label>
                  <h2
                    title={scene.title}
                    className="truncate text-4xl leading-tight text-white md:text-6xl"
                  >
                    {scene.title}
                  </h2>
                  <span className="h-px w-12 bg-primary" />
                </div>

                <dl className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <dt className="flex items-center gap-2 text-sm tracking-widest text-gray uppercase">
                      <CubeIcon />
                      Objects
                    </dt>
                    <dd className="text-4xl text-white tabular-nums md:text-5xl">
                      {formatCount(scene.objects)}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-2">
                    <dt className="flex items-center gap-2 text-sm tracking-widest text-gray uppercase">
                      <TriangleIcon />
                      Triangles
                    </dt>
                    <dd className="text-4xl text-white tabular-nums md:text-5xl">
                      {formatCount(scene.triangles)}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="relative aspect-video md:w-1/2">
                <ImageCompare
                  before={imageUrl(scene.renderImage)}
                  after={imageUrl(scene.viewportImage)}
                  alt={scene.title}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Texturing and UV mapping (optional) */}
      {texturing && (
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-[#0c1118] p-8 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
          <div className="flex flex-col gap-2">
            <Label>Texturing and UV mapping</Label>
            <p className="max-w-160 text-sm leading-relaxed whitespace-pre-line text-white/80">
              {texturing.text}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Label>Palette texture</Label>
            <Image
              src={imageUrl(texturing.paletteImage)}
              alt="Palette texture"
              width={220}
              height={220}
              unoptimized
              className="[image-rendering:pixelated]"
            />
          </div>

          <span className="hidden text-primary lg:block">
            <ArrowRightIcon />
          </span>

          {texturing.uvImages.length > 0 && (
            <div className="flex flex-col gap-4">
              <Label>UV example</Label>
              <div className="flex gap-4">
                {texturing.uvImages.map((fileName) => (
                  <Image
                    key={fileName}
                    src={imageUrl(fileName)}
                    alt="UV example"
                    width={160}
                    height={240}
                    className="h-60 w-auto rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prev / next */}
      <nav className="grid grid-cols-3 items-center text-primary">
        {previousId ? (
          <Link
            href={`/projects/${previousId}`}
            className="flex w-fit items-center gap-3 transition-opacity hover:opacity-80"
          >
            <ArrowLeftIcon />
            Previous Project
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/projects"
          aria-label="All projects"
          className="justify-self-center transition-opacity hover:opacity-80"
        >
          <Icon className="size-7">
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </Icon>
        </Link>
        {nextId && (
          <Link
            href={`/projects/${nextId}`}
            className="flex w-fit items-center gap-3 justify-self-end transition-opacity hover:opacity-80"
          >
            Next Project
            <ArrowRightIcon />
          </Link>
        )}
      </nav>
    </section>
  );
};
