"use client";

export const About = () => {
  return (
    <section
      id="about"
      className="relative h-[50vh] overflow-hidden bg-gray-950"
    >
      <div
        className="absolute inset-0"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="relative z-10 p-20 max-w-600 mx-auto">
          <h2 className="text-4xl text-white">About Me</h2>
        </div>
      </div>
    </section>
  );
};
