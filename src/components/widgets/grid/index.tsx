import { useEffect, useRef } from "react";
import { useViewport } from "@/hooks/useViewport";
import { useWidgetData } from "@/components/widgets/context/WidgetDataContext";
import { Widget } from "./types";
import Twitter from "../variants/twitter";
import Media from "../variants/media";
import Project from "../variants/project";
import Lenis from "lenis";

const WIDGETS: Record<Widget["_type"], React.ComponentType<any>> = {
  twitter: Twitter,
  media: Media,
  project: Project,
};

const GRID_CONFIG = {
  COLUMNS: 7,
  ROWS: 3,
  GAP: 10,
  CELL_SIZES: {
    sm: 120,
    md: 130,
    lg: 140,
    xl: 160,
  } as const,
} as const;

type GridBreakpoint = keyof typeof GRID_CONFIG.CELL_SIZES;

export function WidgetGrid() {
  const { breakpoint } = useViewport();
  const widgets = useWidgetData<Widget[]>("widgets");
  const gridBreakpoint = breakpoint as GridBreakpoint;
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const centerScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const targetScroll = Math.max(0, (scrollWidth - clientWidth) / 2);
    lenisRef.current?.scrollTo(targetScroll, { immediate: true });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Lenis once
    lenisRef.current = new Lenis({
      wrapper: containerRef.current,
      orientation: "horizontal",
      gestureOrientation: "horizontal",
      smoothWheel: true,
      syncTouch: true,
      autoRaf: true,
    });

    // Initial center
    centerScroll();

    // Watch for size changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(centerScroll);
    });
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      lenisRef.current?.destroy();
    };
  }, [widgets, breakpoint]);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar relative flex w-full overflow-x-auto before:flex-1 after:flex-1"
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, ${GRID_CONFIG.CELL_SIZES[gridBreakpoint]}px)`,
          gridTemplateRows: `repeat(${GRID_CONFIG.ROWS}, ${GRID_CONFIG.CELL_SIZES[gridBreakpoint]}px)`,
          gap: `${GRID_CONFIG.GAP}px`,
          padding: "1rem",
        }}
      >
        {widgets?.map((widget) => {
          const Widget = WIDGETS[widget._type];
          if (!Widget) return null;
          return <Widget key={widget._key} data={widget} />;
        })}
      </div>
    </div>
  );
}
