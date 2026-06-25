"use client";

import { useRef } from "react";
import { Button } from "./_common/button";
import { ParallaxBackground } from "./_common/parallax-background";

export const Home = () => {
  const container = useRef<HTMLElement>(null);

  return (
    <main
      ref={container}
      id="home"
      className="relative h-screen overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <ParallaxBackground
          containerRef={container}
          src="/hero-background.png"
          alt="Hero"
          className="opacity-5"
          strength={15}
        />
      </div>

      <div className="relative z-10 flex h-full items-center p-20 max-w-600 mx-auto">
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-sm text-primary uppercase">
            3D ARTIST & CREATOR
          </span>
          <h1 className="text-5xl text-white">Bringing ideas to Life in 3D</h1>
          <p className="text-gray-400">
            Hello, my name is Attila Tolnai, and I’m a 3D artist focused on
            transforming ideas into fully realized 3D creations through Blender.
            I specialize in crafting stylized props, game-ready assets, and
            small environments that combine creativity with strong visual
            design.
          </p>
          <div>
            <Button>View my work</Button>
          </div>
        </div>
      </div>
    </main>
  );
};
