import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { CMS_PATH } from "@/lib/site";
import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: PageProps<"/studio-a3145d39/login">) {
  if (await isAdmin()) redirect(CMS_PATH);
  const { error } = await searchParams;

  return (
    <form
      action={login}
      className="mx-auto mt-24 flex w-full max-w-sm flex-col gap-4"
    >
      <h1 className="text-2xl">Studio login</h1>
      <input
        type="password"
        name="key"
        required
        autoFocus
        autoComplete="current-password"
        aria-label="Key"
        placeholder="Key"
        className="rounded-lg border border-white/20 bg-black/40 px-3 py-2"
      />
      {error && <p className="text-sm text-red-400">Wrong key.</p>}
      <button className="rounded-lg bg-primary px-4 py-2 text-black">
        Log in
      </button>
    </form>
  );
}
