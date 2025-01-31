import { useEffect, useRef } from "react";
import { useViewport } from "@/lib/hooks/use-viewport";
import { useWidgetData } from "@/components/widgets/grid/context";
import { useDebug } from "@/lib/contexts/debug";
import { Widget, WidgetRegistry } from "./types";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";

const GRID_CONFIG = {
  COLUMNS: 7,
  ROWS: 3,
  GAP: 10,
  CELL_SIZES: {
    sm: 100,
    md: 130,
    lg: 140,
    xl: "min(140px, 11vw)",
    "2xl": "min(160px, 12vw)",
    "3xl": "min(180px, 13vw)",
  } as const,
} as const;

type GridBreakpoint = keyof typeof GRID_CONFIG.CELL_SIZES;

const DebugGridOverlay = () => {
  const { breakpoint } = useViewport();
  const gridBreakpoint = breakpoint as GridBreakpoint;

  return (
    <div
      className="absolute inset-4 z-50 grid"
      style={{
        gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, ${GRID_CONFIG.CELL_SIZES[gridBreakpoint]}px)`,
        gridTemplateRows: `repeat(${GRID_CONFIG.ROWS}, ${GRID_CONFIG.CELL_SIZES[gridBreakpoint]}px)`,
        gap: `${GRID_CONFIG.GAP}px`,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: GRID_CONFIG.COLUMNS * GRID_CONFIG.ROWS }).map(
        (_, i) => {
          const col = (i % GRID_CONFIG.COLUMNS) + 1;
          const row = Math.floor(i / GRID_CONFIG.COLUMNS) + 1;
          return (
            <>
              <div
                key={i}
                className="border-1 z-10 flex items-center justify-center border border-stone-500/25 bg-stone-300/30 text-xs font-medium"
              >
                <h2 className="rounded-3xl border border-neutral-500/25 bg-neutral-50 p-2 text-xs font-medium">
                  R{row} C{col}
                </h2>
              </div>
            </>
          );
        },
      )}
    </div>
  );
};

interface WidgetGridProps {
  components: WidgetRegistry;
}

export function WidgetGrid({ components }: WidgetGridProps) {
  const { breakpoint } = useViewport();
  const widgets = useWidgetData<Widget[]>("widgets");
  const gridBreakpoint = breakpoint as GridBreakpoint;
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { debug } = useDebug();
  const gridRef = useRef<HTMLDivElement>(null);

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
      // syncTouch: true,
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
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
      ref={containerRef}
      className="hide-scrollbar relative flex w-full overflow-x-auto before:flex-1 after:flex-1"
    >
      <div
        ref={gridRef}
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, ${
            typeof GRID_CONFIG.CELL_SIZES[gridBreakpoint] === "number"
              ? `${GRID_CONFIG.CELL_SIZES[gridBreakpoint]}px`
              : GRID_CONFIG.CELL_SIZES[gridBreakpoint]
          })`,
          gridTemplateRows: `repeat(${GRID_CONFIG.ROWS}, ${
            typeof GRID_CONFIG.CELL_SIZES[gridBreakpoint] === "number"
              ? `${GRID_CONFIG.CELL_SIZES[gridBreakpoint]}px`
              : GRID_CONFIG.CELL_SIZES[gridBreakpoint]
          })`,
          gap: `${GRID_CONFIG.GAP}px`,
          padding: "1rem",
        }}
      >
        {debug && <DebugGridOverlay />}
        {widgets?.map((widget) => {
          const Widget = components[widget._type];
          if (!Widget) return null;
          return <Widget key={widget._key} data={widget} />;
        })}
      </div>
    </motion.div>
  );
}
