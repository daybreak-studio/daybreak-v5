import { useState, useEffect } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

function getBreakpoint(width: number): Breakpoint | null {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return null;
}

export function useBreakpoint() {
  // Start with null during SSR
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    // Set initial size
    setWidth(window.innerWidth);
    setBreakpoint(getBreakpoint(window.innerWidth));

    // Add event listener
    let timeoutId: NodeJS.Timeout;
    function handleResize() {
      clearTimeout(timeoutId);
      // Debounce resize events
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
        setBreakpoint(getBreakpoint(window.innerWidth));
      }, 100);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    breakpoint,
    width,
    // Utility functions
    isDesktop: width >= BREAKPOINTS.md,
    isMobile: width < BREAKPOINTS.md,
    // Allow checking any breakpoint
    isBreakpoint: (bp: Breakpoint) => width >= BREAKPOINTS[bp],
  };
}
