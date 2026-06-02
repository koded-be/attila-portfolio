import { Button } from "./_common/button";

export const About = () => {
  return (
    <section
      id="about"
      className="flex h-screen items-center justify-center text-center p-20"
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-5xl text-primary">3D ARTIST & CREATOR</h2>
        <span className="text-2xl text-white">Atilla Tolnai</span>
        <p className="text-xl my-4 text-white max-w-3xl">
          Hello, my name is Attila Tolnai, and I’m a 3D artist focused on
          transforming ideas into fully realized 3D creations through Blender. I
          specialize in crafting stylized props, game-ready assets, and small
          environments that combine creativity with strong visual design.
        </p>

        <div>
          <Button>Contact me</Button>
        </div>
      </div>
    </section>
  );
};
