import { useState, useEffect } from "react";

// Match Tailwind's default breakpoints
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 2200,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    breakpoint: "xs" as Breakpoint,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getBreakpoint = (width: number): Breakpoint => {
      if (width >= BREAKPOINTS["3xl"]) return "3xl";
      if (width >= BREAKPOINTS["2xl"]) return "2xl";
      if (width >= BREAKPOINTS.xl) return "xl";
      if (width >= BREAKPOINTS.lg) return "lg";
      if (width >= BREAKPOINTS.md) return "md";
      if (width >= BREAKPOINTS.sm) return "sm";
      return "xs";
    };

    const handleResize = () => {
      const width = window.innerWidth;
      setViewport({
        width,
        breakpoint: getBreakpoint(width),
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}
