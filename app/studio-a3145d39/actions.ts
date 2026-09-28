"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  checkKey,
  endSession,
  requireAdmin,
  startSession,
} from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getProject } from "@/lib/db/projects";
import { projects, type Scene, type Texturing } from "@/lib/db/schema";
import { CMS_PATH } from "@/lib/site";
import { projectImageStorage } from "@/lib/storage/project-image-storage";

// Leaves room for multipart overhead under the 4.5 MB body limit
const MAX_FILE_BYTES = 4.4 * 1024 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILE_NAME = /^[a-zA-Z0-9._-]+$/;

export async function login(formData: FormData) {
  if (!checkKey(String(formData.get("key") ?? ""))) {
    redirect(`${CMS_PATH}/login?error=1`);
  }
  await startSession();
  redirect(CMS_PATH);
}

export async function logout() {
  await endSession();
  redirect(`${CMS_PATH}/login`);
}

export async function uploadImage(projectId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!UUID.test(projectId)) return { error: "Invalid project" };
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return { error: "Please choose an image file" };
  }
  if (file.size > MAX_FILE_BYTES)
    return { error: "Image must be under 4.4 MB" };

  // Random prefix so two uploads named e.g. "render.png" never overwrite each other
  const fileName = `${Date.now().toString(36)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const uploaded = await projectImageStorage.uploadProjectImage(
    projectId,
    new File([file], fileName, { type: file.type }),
  );
  return uploaded ? { fileName } : { error: "Upload failed, try again" };
}

export type ProjectInput = {
  title: string;
  text: string;
  software: string;
  projectType: string;
  heroImage: string;
  images: string[];
  scenes: Scene[];
  texturing: Texturing;
};

const isFile = (v: unknown): v is string =>
  typeof v === "string" && FILE_NAME.test(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// Validates untrusted client input into a DB row; throws a user-facing message
function parseProject(input: ProjectInput) {
  const title = str(input.title);
  if (!title) throw new Error("Title is required");

  const images = (input.images ?? []).filter(isFile);
  const scenes = (input.scenes ?? []).map((s, i) => {
    if (!str(s.title)) throw new Error(`Scene ${i + 1} needs a title`);
    if (!isFile(s.renderImage) || !isFile(s.viewportImage)) {
      throw new Error(`Scene ${i + 1} needs a render and a viewport image`);
    }
    return {
      title: str(s.title),
      objects: Math.max(0, Math.round(Number(s.objects) || 0)),
      triangles: Math.max(0, Math.round(Number(s.triangles) || 0)),
      renderImage: s.renderImage,
      viewportImage: s.viewportImage,
    };
  });

  const t = input.texturing ?? { text: "", paletteImage: "", uvImages: [] };
  const uvImages = (t.uvImages ?? []).filter(isFile);
  const hasTexturing = !!(str(t.text) || t.paletteImage || uvImages.length);
  if (hasTexturing && !isFile(t.paletteImage)) {
    throw new Error(
      "Texturing needs a palette image (or clear the texturing section)",
    );
  }

  return {
    title,
    text: str(input.text) || null,
    software: str(input.software) || null,
    projectType: str(input.projectType) || null,
    heroImage: isFile(input.heroImage) ? input.heroImage : null,
    images,
    scenes,
    texturing: hasTexturing
      ? { text: str(t.text), paletteImage: t.paletteImage, uvImages }
      : null,
  };
}

// Inserts on first save (new projects get their id client-side), updates after
export async function saveProject(id: string, input: ProjectInput) {
  await requireAdmin();
  if (!UUID.test(id)) return { error: "Invalid project" };

  let values;
  try {
    values = parseProject(input);
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db
    .insert(projects)
    .values({ id, ...values })
    .onConflictDoUpdate({ target: projects.id, set: values });
  return { ok: true };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  if (await getProject(id)) {
    await db.delete(projects).where(eq(projects.id, id));
    await projectImageStorage.deleteProjectImages(id);
  }
  redirect(CMS_PATH);
}

export async function replaceResume(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.type !== "application/pdf") {
    redirect(`${CMS_PATH}?resume=invalid`);
  }
  if (file.size > MAX_FILE_BYTES) redirect(`${CMS_PATH}?resume=too-big`);
  await projectImageStorage.uploadResume(file);
  redirect(`${CMS_PATH}?resume=ok`);
}
