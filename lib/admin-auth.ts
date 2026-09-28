import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CMS_PATH } from "./site";

const COOKIE = "admin";

const sha = (value: string) => createHash("sha256").update(value).digest();
const sessionToken = () =>
  createHmac("sha256", process.env.ADMIN_KEY!).update("admin").digest("hex");
const safeEqual = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

// ponytail: no login rate limiting; the long random ADMIN_KEY makes brute force impractical
export const checkKey = (key: string) =>
  !!process.env.ADMIN_KEY && safeEqual(key, process.env.ADMIN_KEY);

export async function startSession() {
  (await cookies()).set(COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: CMS_PATH,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: CMS_PATH });
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  return !!value && !!process.env.ADMIN_KEY && safeEqual(value, sessionToken());
}

// Call at the top of every CMS page AND every CMS server action
export async function requireAdmin() {
  if (!(await isAdmin())) redirect(`${CMS_PATH}/login`);
}
