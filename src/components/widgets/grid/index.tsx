import { useEffect, useRef } from "react";
import { useWidgetData } from "@/components/widgets/grid/context";
import { useDebug } from "@/lib/contexts/debug";
import { Widget, WidgetRegistry } from "./types";
import { motion } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";
import { useBreakpoint } from "@/lib/hooks/use-media-query";

const GRID_CONFIG = {
  COLUMNS: 7,
  ROWS: 3,
  GAP: 10,
  CELL_SIZES: {
    sm: "clamp(100px, 15vw, 100px)",
    md: "clamp(110px, 16vw, 120px)",
    lg: "clamp(120px, 17vw, 130px)",
    xl: "clamp(80px, 12vw, 120px)",
    "2xl": "clamp(140px, 19vw, 160px)",
    "3xl": "clamp(150px, 20vw, 180px)",
  } as const,
} as const;

type GridBreakpoint = keyof typeof GRID_CONFIG.CELL_SIZES;

const DebugGridOverlay = () => {
  const breakpoint = useBreakpoint() as GridBreakpoint;

  return (
    <div
      className="absolute inset-4 z-50 grid"
      style={{
        gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, ${GRID_CONFIG.CELL_SIZES[breakpoint]})`,
        gridTemplateRows: `repeat(${GRID_CONFIG.ROWS}, ${GRID_CONFIG.CELL_SIZES[breakpoint]})`,
        gap: `clamp(6px, 1vw, ${GRID_CONFIG.GAP}px)`,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: GRID_CONFIG.COLUMNS * GRID_CONFIG.ROWS }).map(
        (_, i) => {
          const col = (i % GRID_CONFIG.COLUMNS) + 1;
          const row = Math.floor(i / GRID_CONFIG.COLUMNS) + 1;
          return (
            <div
              key={i}
              className="border-1 z-10 flex items-center justify-center border border-stone-500/25 bg-stone-300/30 text-xs font-medium"
            >
              <h2 className="rounded-3xl border border-neutral-500/25 bg-neutral-50 p-2 text-xs font-medium">
                R{row} C{col}
              </h2>
            </div>
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
  const breakpoint = useBreakpoint() as GridBreakpoint;
  const widgets = useWidgetData<Widget[]>("widgets");

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { debug } = useDebug();

  const centerScroll = () => {
    if (!containerRef.current || !gridRef.current) return;
    const container = containerRef.current;
    const grid = gridRef.current;
    const wrapper = container.querySelector(".grid-wrapper") as HTMLElement;

    if (!wrapper) return;

    // Calculate the total scrollable width
    const totalWidth = grid.offsetWidth;
    const viewportWidth = container.offsetWidth;

    // Set wrapper width to be at least viewport width
    wrapper.style.minWidth = `${viewportWidth}px`;

    // Center the grid within the wrapper
    const leftPadding = Math.max(viewportWidth / 2 - totalWidth / 2, 0);
    wrapper.style.paddingLeft = `${leftPadding}px`;

    // Initial scroll position to center
    const scrollTarget = (totalWidth + leftPadding * 2 - viewportWidth) / 2;
    container.scrollTo({ left: scrollTarget, behavior: "instant" });
  };

  useEffect(() => {
    // Initial center
    centerScroll();

    // Watch for size changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(centerScroll);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [widgets, breakpoint]);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
      ref={containerRef}
      className="hide-scrollbar relative w-full overflow-x-auto scroll-smooth"
    >
      <div className="grid-wrapper flex w-full items-center">
        <div
          ref={gridRef}
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, ${GRID_CONFIG.CELL_SIZES[breakpoint]})`,
            gridTemplateRows: `repeat(${GRID_CONFIG.ROWS}, ${GRID_CONFIG.CELL_SIZES[breakpoint]})`,
            gap: `clamp(6px, 1vw, ${GRID_CONFIG.GAP}px)`,
            padding: "clamp(0.5rem, 2vw, 1rem)",
          }}
        >
          {debug && <DebugGridOverlay />}
          {widgets?.map((widget) => {
            const Widget = components[widget._type];
            if (!Widget) return null;
            return <Widget key={widget._key} data={widget} />;
          })}
        </div>
      </div>
    </motion.div>
  );
}
