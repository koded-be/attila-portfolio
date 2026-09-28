"use client";

import Image from "next/image";
import { useState } from "react";

type ImageCompareProps = {
  before: string;
  after: string;
  alt: string;
};

export const ImageCompare = ({ before, after, alt }: ImageCompareProps) => {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      <Image
        src={after}
        alt={`${alt} viewport`}
        fill
        sizes="(min-width: 768px) 70vw, 100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${alt} render`}
          fill
          sizes="(min-width: 768px) 70vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Native range input handles drag, click and keyboard; the visible handle below just mirrors it */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={`Compare ${alt} render and viewport`}
        className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
      <div
        className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-primary peer-focus-visible:*:ring-2 peer-focus-visible:*:ring-white"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-black shadow-(--button-glow)">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden
          >
            <path d="m9 7-5 5 5 5" />
            <path d="m15 7 5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  );
};
