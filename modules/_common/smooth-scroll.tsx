"use client";
import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export const SmoothScrollProvider = ({
  children,
}: SmoothScrollProviderProps) => {
  return <ReactLenis root>{children}</ReactLenis>;
};
