import { useState, useEffect } from "react";

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Hook to check if a media query matches
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", handler);
    return () => mediaQueryList.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Hook to get current breakpoint
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("sm");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS["3xl"]) setBreakpoint("3xl");
      else if (width >= BREAKPOINTS["2xl"]) setBreakpoint("2xl");
      else if (width >= BREAKPOINTS.xl) setBreakpoint("xl");
      else if (width >= BREAKPOINTS.lg) setBreakpoint("lg");
      else if (width >= BREAKPOINTS.md) setBreakpoint("md");
      else setBreakpoint("sm");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

// Common media query hooks
export function useIsHoverEnabled() {
  return useMediaQuery("(hover: hover)");
}

export function useIsTouchDevice() {
  return useMediaQuery("(hover: none)");
}

export function useIsDarkMode() {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

// Breakpoint hooks
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
}

export function useIsTablet() {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  );
}

export function useIsLargeScreen() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
}

// Helper to create a min-width media query
export function useMinWidth(width: number) {
  return useMediaQuery(`(min-width: ${width}px)`);
}

// Helper to create a max-width media query
export function useMaxWidth(width: number) {
  return useMediaQuery(`(max-width: ${width}px)`);
}
