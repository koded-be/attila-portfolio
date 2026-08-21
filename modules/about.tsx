"use client";

export const About = () => {
  return (
    <section
      id="about"
      className="relative min-h-[50vh] overflow-hidden bg-gray-950"
    >
      <div
        className="absolute inset-0"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="relative z-10 max-w-600 mx-auto px-6 py-20 md:px-20">
          <span className="text-sm text-primary uppercase">Get to know me</span>
          <h2 className="text-4xl md:text-5xl text-white mt-2">About Me</h2>

          {/* Content */}
          <div className="mt-10 flex flex-wrap gap-10">
            <p className="w-400 max-w-[70%] text-white/70 text-sm md:text-base leading-relaxed">
              I&apos;m Attila Tolnai, a 3D Artist based in Belgium. I recently
              completed my Bachelor&apos;s degree in Multimedia and Creative
              Technology at Erasmus Hogeschool Brussels (2018-2025),
              specializing in 3D Modelling and Graphic Design. I love bringing
              ideas to life — whether that&apos;s sculpting and texturing a prop
              from scratch, building out a scene in Blender, or crafting a
              motion graphics piece from initial concept to final animation.
              I&apos;m a persistent, curious problem-solver who thrives in
              collaborative environments, but I&apos;m just as comfortable
              working independently to push a project across the finish line.
            </p>

            <div className="flex flex-col gap-4 text-sm text-white/50">
              <div>
                <p className="text-white/80 font-medium">Focus</p>
                <p>3D Modelling & Motion Graphics</p>
              </div>
              <div>
                <p className="text-white/80 font-medium">Tools</p>
                <p>Blender · Unity · Photoshop</p>
              </div>
              <div>
                <p className="text-white/80 font-medium">
                  See more about me in detail
                </p>
                <div className="my-4">
                  <a
                    className="text-primary underline hover:text-primary/80 transition-colors duration-300"
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
