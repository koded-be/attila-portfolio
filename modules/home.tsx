"use client";

import { Button } from "./_common/button";

export const Home = () => {
  return (
    <main id="home" className="flex h-screen items-center p-20">
      <div className="flex flex-col gap-4 max-w-3xl">
        <span className="text-sm text-primary uppercase">
          3D ARTIST & CREATOR
        </span>
        <h1 className="text-5xl text-white">Bringing ideas to Life in 3D</h1>
        <p className="text-gray-400">
          Hello, my name is Attila Tolnai, and I’m a 3D artist focused on
          transforming ideas into fully realized 3D creations through Blender. I
          specialize in crafting stylized props, game-ready assets, and small
          environments that combine creativity with strong visual design.
        </p>
        <div>
          <Button>View my work</Button>
        </div>
      </div>
    </main>
  );
};
