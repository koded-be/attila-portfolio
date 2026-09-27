"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  saveProject,
  uploadImage,
  type ProjectInput,
} from "@/app/studio-a3145d39/actions";
import type { Scene } from "@/lib/db/schema";
import { CMS_PATH } from "@/lib/site";

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2";
const smallButton = "text-sm text-gray underline hover:text-white";

type ProjectFormProps = {
  id: string;
  isNew: boolean;
  imageBase: string;
  initial: ProjectInput;
};

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm uppercase tracking-widest text-primary">
      {label}
    </span>
    {hint && <span className="text-sm text-gray">{hint}</span>}
    {children}
  </label>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <fieldset className="flex flex-col gap-4 rounded-2xl border border-white/10 p-5">
    <legend className="px-2 text-lg">{title}</legend>
    {children}
  </fieldset>
);

type Uploader = {
  upload: (file: File) => Promise<string | null>;
  imageBase: string;
};

const ImageField = ({
  value,
  onChange,
  upload,
  imageBase,
}: Uploader & {
  value: string;
  onChange: (fileName: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-black/40">
        {value && (
          <Image
            src={imageBase + value}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            const fileName = await upload(file);
            setUploading(false);
            if (fileName) onChange(fileName);
          }}
          className="text-sm"
        />
        {uploading && <span className="text-sm text-gray">Uploading…</span>}
        {value && !uploading && (
          <button
            type="button"
            className={smallButton}
            onClick={() => onChange("")}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

// A list of images with add / remove / reorder
const ImageList = ({
  values,
  onChange,
  ...uploader
}: Uploader & {
  values: string[];
  onChange: (values: string[]) => void;
}) => {
  const move = (from: number, to: number) => {
    const next = [...values];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-3">
      {values.map((value, i) => (
        <div key={value} className="flex items-center gap-4">
          <ImageField
            {...uploader}
            value={value}
            onChange={(v) =>
              onChange(
                v
                  ? values.map((x, j) => (j === i ? v : x))
                  : values.filter((_, j) => j !== i),
              )
            }
          />
          <div className="flex gap-3">
            {i > 0 && (
              <button
                type="button"
                className={smallButton}
                onClick={() => move(i, i - 1)}
              >
                Up
              </button>
            )}
            {i < values.length - 1 && (
              <button
                type="button"
                className={smallButton}
                onClick={() => move(i, i + 1)}
              >
                Down
              </button>
            )}
          </div>
        </div>
      ))}
      <ImageField
        {...uploader}
        value=""
        onChange={(v) => v && onChange([...values, v])}
      />
    </div>
  );
};

export const ProjectForm = ({
  id,
  isNew,
  imageBase,
  initial,
}: ProjectFormProps) => {
  const router = useRouter();
  const [project, setProject] = useState(initial);
  const [status, setStatus] = useState<{
    ok?: boolean;
    message: string;
  } | null>(null);
  const [saving, startSaving] = useTransition();

  const set = (patch: Partial<ProjectInput>) =>
    setProject((p) => ({ ...p, ...patch }));
  const setScene = (index: number, patch: Partial<Scene>) =>
    set({
      scenes: project.scenes.map((s, i) =>
        i === index ? { ...s, ...patch } : s,
      ),
    });
  const setTexturing = (patch: Partial<ProjectInput["texturing"]>) =>
    set({ texturing: { ...project.texturing, ...patch } });

  // Uploads immediately and resolves to the stored filename (or null on error)
  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImage(id, formData);
    if ("error" in result) {
      setStatus({ message: result.error ?? "Upload failed" });
      return null;
    }
    return result.fileName ?? null;
  };

  const uploader = { upload, imageBase };

  const save = () =>
    startSaving(async () => {
      setStatus(null);
      const result = await saveProject(id, project);
      if ("error" in result) {
        setStatus({ message: result.error ?? "Save failed" });
        return;
      }
      setStatus({ ok: true, message: "Saved." });
      if (isNew) router.replace(`${CMS_PATH}/projects/${id}`);
    });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="flex items-center justify-between">
        <Link href={CMS_PATH} className={smallButton}>
          ← All projects
        </Link>
        {!isNew && (
          <Link
            href={`/projects/${id}`}
            target="_blank"
            className={smallButton}
          >
            View on site
          </Link>
        )}
      </div>
      <h1 className="text-3xl">{isNew ? "New project" : "Edit project"}</h1>

      <Section title="General">
        <Field label="Title">
          <input
            className={inputClass}
            required
            value={project.title}
            onChange={(e) => set({ title: e.target.value })}
          />
        </Field>
        <Field label="Why? (description)">
          <textarea
            className={inputClass}
            rows={5}
            value={project.text}
            onChange={(e) => set({ text: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Software">
            <input
              className={inputClass}
              value={project.software}
              onChange={(e) => set({ software: e.target.value })}
            />
          </Field>
          <Field label="Project type">
            <input
              className={inputClass}
              value={project.projectType}
              onChange={(e) => set({ projectType: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Hero image">
        <p className="text-sm text-gray">
          Large image at the top of the project page.
        </p>
        <ImageField
          {...uploader}
          value={project.heroImage}
          onChange={(heroImage) => set({ heroImage })}
        />
      </Section>

      <Section title="Card images">
        <p className="text-sm text-gray">
          The first image is the thumbnail. The 2nd and 3rd show as small
          previews on the home page.
        </p>
        <ImageList
          {...uploader}
          values={project.images}
          onChange={(images) => set({ images })}
        />
      </Section>

      <Section title="Scenes">
        {project.scenes.map((scene, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl bg-black/30 p-4"
          >
            <div className="flex items-center justify-between">
              <span>Scene {i + 1}</span>
              <button
                type="button"
                className={smallButton}
                onClick={() =>
                  set({ scenes: project.scenes.filter((_, j) => j !== i) })
                }
              >
                Remove scene
              </button>
            </div>
            <Field label="Title">
              <input
                className={inputClass}
                value={scene.title}
                onChange={(e) => setScene(i, { title: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Objects">
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={scene.objects}
                  onChange={(e) =>
                    setScene(i, { objects: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Triangles">
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={scene.triangles}
                  onChange={(e) =>
                    setScene(i, { triangles: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-sm uppercase tracking-widest text-primary">
                  Render
                </span>
                <ImageField
                  {...uploader}
                  value={scene.renderImage}
                  onChange={(renderImage) => setScene(i, { renderImage })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm uppercase tracking-widest text-primary">
                  Viewport
                </span>
                <ImageField
                  {...uploader}
                  value={scene.viewportImage}
                  onChange={(viewportImage) => setScene(i, { viewportImage })}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="self-start rounded-lg border border-white/20 px-4 py-2"
          onClick={() =>
            set({
              scenes: [
                ...project.scenes,
                {
                  title: "",
                  objects: 0,
                  triangles: 0,
                  renderImage: "",
                  viewportImage: "",
                },
              ],
            })
          }
        >
          Add scene
        </button>
      </Section>

      <Section title="Texturing and UV mapping (optional)">
        <Field label="Text">
          <textarea
            className={inputClass}
            rows={3}
            value={project.texturing.text}
            onChange={(e) => setTexturing({ text: e.target.value })}
          />
        </Field>
        <span className="text-sm uppercase tracking-widest text-primary">
          Palette texture
        </span>
        <ImageField
          {...uploader}
          value={project.texturing.paletteImage}
          onChange={(paletteImage) => setTexturing({ paletteImage })}
        />
        <span className="text-sm uppercase tracking-widest text-primary">
          UV examples
        </span>
        <ImageList
          {...uploader}
          values={project.texturing.uvImages}
          onChange={(uvImages) => setTexturing({ uvImages })}
        />
      </Section>

      <div className="sticky bottom-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0c1118] p-4">
        <button
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-2 text-black disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {status && (
          <span className={status.ok ? "text-primary" : "text-red-400"}>
            {status.message}
          </span>
        )}
      </div>
    </form>
  );
};
