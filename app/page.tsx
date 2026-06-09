"use client";

import Image from "next/image";

export default function Page() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center p-6 sm:p-20">
        <div className="flex w-full max-w-2xl flex-col gap-8 text-center sm:gap-10">
          <div className="flex flex-col items-center justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="Attila Tolnai"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
            <span className="mt-4 text-sm text-primary uppercase tracking-wider">
              Coming Soon
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight sm:text-6xl">
            Something <span className="text-primary">Amazing</span> is brewing
          </h1>

          <p className="text-base text-gray-400 max-w-xl mx-auto sm:text-lg">
            I&apos;m working on something incredible that will showcase my
            latest 3D creations and projects. Stay tuned for the unveiling.
          </p>

          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-primary uppercase">
                Crafting in progress
              </span>
            </div>

            <p className="text-sm text-gray-500">
              In the meantime, you can reach out to me with inquiries or
              collaboration opportunities.
            </p>
          </div>

          <div className="mt-12">
            <a
              href="mailto:attila.tolnai170@gmail.com"
              className="uppercase cursor-pointer text-black py-3 px-8 rounded-full bg-[linear-gradient(90deg,var(--button-gradient-from),var(--button-gradient-to))] shadow-(--button-glow) hover:opacity-95 transition duration-200 inline-block"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
