"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { RefObject } from "react";

type ParallaxBackgroundProps = {
  /** Ref of the section (or wrapping container) the parallax should track */
  containerRef: RefObject<HTMLElement | null>;
  src: string;
  alt?: string;
  /** Opacity of the image, defaults to full strength */
  className?: string;
  /** How far the image travels, in vh. Larger = more dramatic drift. */
  strength?: number;
};

/**
 * Background image parallax, following the "advanced" technique from
 * https://blog.olivierlarose.com/tutorials/background-image-parallax
 *
 * - The image lives in a `fixed` wrapper taller than the viewport
 *   (100vh + 2 * strength) so it has room to translate without
 *   exposing empty edges.
 * - The parent section uses a clip-path so the fixed image is only
 *   ever visible within that section's bounds, even though the image
 *   itself isn't a child of a normal scrolling box.
 * - useScroll + useTransform translate the image between
 *   `-strength vh` and `+strength vh` as the tracked container moves
 *   through the viewport.
 */
export const ParallaxBackground = ({
  containerRef,
  src,
  alt = "",
  className = "",
  strength = 15,
}: ParallaxBackgroundProps) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}vh`, `${strength}vh`],
  );

  return (
    <div
      className="fixed left-0 w-full"
      style={{
        top: `-${strength}vh`,
        height: `${100 + strength * 2}vh`,
      }}
    >
      <motion.div style={{ y }} className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          priority
        />
      </motion.div>
    </div>
  );
};
