import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 text-white">
      {children}
    </main>
  );
}
