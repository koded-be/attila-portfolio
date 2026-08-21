import Image from "next/image";
import { Button } from "./_common/button";

export const Contact = () => {
  return (
    <section
      id="contact"
      className="flex items-center bg-gray-950 min-h-screen"
    >
      <div className="flex flex-col gap-4 p-20 w-full max-w-600 mx-auto bg-gray-900 rounded-2xl">
        <div className="grid grid-cols-2 gap-16 w-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl text-primary uppercase mb-8">Contact Me</h2>
            <Image
              src="/TilaFoto.jpg"
              alt="Picture Attila Tolnai"
              width={400}
              height={400}
              className="rounded-full"
            />
          </div>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-white/70">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-white/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="idea" className="text-sm text-white/70">
                Please tell us more about your idea
              </label>
              <textarea
                id="idea"
                placeholder="What can I do for you?"
                rows={4}
                className="w-full resize-none rounded-lg border border-white/15 bg-transparent px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-sm text-white/70">
                Company
              </label>
              <input
                id="company"
                type="text"
                placeholder="koded."
                className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <Button>Contact me</Button>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <p className="text-sm text-white/40">
                Or mail me at{" "}
                <a
                  href="mailto:attila.tolnai170@gmail.com"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  attila.tolnai170@gmail.com
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
