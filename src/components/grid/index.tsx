import { useDebug } from "@/contexts/DebugContext";
import Lenis from "lenis";
import { useScramble } from "use-scramble";
import { WidgetGridContext } from "./hooks";
import { GridProps } from "./props";
import clsx from "clsx";
import Twitter from "@/components/widgets/twitter";
import Media from "@/components/widgets/media";
import Project from "@/components/widgets/project";
import type { Home, Clients } from "@/sanity/types";
import { useEffect, useRef } from "react";
import { useViewport } from "@/hooks/useViewport";

type Widget = NonNullable<Home["widgets"]>[number];

interface WidgetGridProps {
  widgets: NonNullable<Home["widgets"]>;
  clientsData: Clients[];
  debug?: boolean;
}

// Grid Configuration
const GRID_CONFIG = {
  COLUMNS: 7,
  ROWS: 3,
  GAP: 32,
  CELL_SIZES: {
    xs: 105,
    sm: 120,
    md: 130,
    lg: 140,
    xl: 160,
    "2xl": 180,
    "3xl": 220,
  },
} as const;

const WIDGET_SIZES = {
  "1x1": { width: 1, height: 1 },
  "2x2": { width: 2, height: 2 },
  "3x3": { width: 3, height: 3 },
} as const;

const getWidgetDimensions = (size: Widget["size"]) => {
  return WIDGET_SIZES[size || "1x1"];
};

export const WidgetGridProvider = ({
  id,
  size,
  position,
  dimensions,
  breakpoint,
  children,
}: GridProps.Provider) => (
  <WidgetGridContext.Provider
    value={{ id, size, position, dimensions, breakpoint }}
  >
    {children}
  </WidgetGridContext.Provider>
);

const renderWidgetContent = (widget: Widget, clientsData: Clients[]) => {
  switch (widget._type) {
    case "twitterWidget":
      return (
        <Twitter
          tweet={widget.tweet}
          author={widget.author}
          link={widget.link}
        />
      );
    case "mediaWidget":
      return <Media media={widget.media?.[0]} />;
    case "projectWidget":
      return (
        <Project
          clientsData={clientsData}
          selectedClient={widget.selectedClient}
          projectType={widget.projectType}
          projectCategory={widget.projectCategory}
        />
      );
    default:
      return null;
  }
};

function isValidWidget(widget: Widget): widget is Widget & {
  position: { row: number; column: number };
  size: "1x1" | "2x2" | "3x3";
} {
  return (
    widget.position !== undefined &&
    widget.position.row !== undefined &&
    widget.position.column !== undefined &&
    widget.size !== undefined
  );
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  clientsData,
  debug,
}) => {
  const { debug: globalDebug } = useDebug();
  const { breakpoint } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);

  const centerScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const targetScroll = Math.max(0, (scrollWidth - clientWidth) / 2);

    container.scrollTo({
      left: targetScroll,
      behavior: "instant",
    });
  };

  // Initialize Lenis and handle scroll centering
  useEffect(() => {
    if (!containerRef.current) return;

    const lenis = new Lenis({
      autoRaf: true,
      wrapper: containerRef.current,
      orientation: "horizontal",
      gestureOrientation: "horizontal",
      syncTouch: true,
    });

    centerScroll();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(centerScroll);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [widgets, breakpoint]);

  return (
    // <div className="relative h-screen w-screen">
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div
        ref={containerRef}
        className="hide-scrollbar relative flex w-full overflow-x-auto before:flex-1 after:flex-1"
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, ${GRID_CONFIG.CELL_SIZES[breakpoint]}px)`,
            gridTemplateRows: `repeat(${GRID_CONFIG.ROWS}, ${GRID_CONFIG.CELL_SIZES[breakpoint]}px)`,
            padding: `1rem`,
            gap: `10px`,
          }}
        >
          {widgets.filter(isValidWidget).map((widget) => {
            const { width, height } = getWidgetDimensions(widget.size);

            return (
              <div
                key={widget._key}
                className={clsx(
                  "frame-outer relative overflow-hidden transition-transform",
                  {
                    "hover:scale-[101%]": !globalDebug,
                    "hover:opacity-50": globalDebug,
                  },
                )}
                style={{
                  gridColumn: `${widget.position.column} / span ${width}`,
                  gridRow: `${widget.position.row} / span ${height}`,
                  aspectRatio: "1 / 1",
                }}
              >
                <div className="h-full w-full">
                  <WidgetGridProvider
                    id={widget._key}
                    size={widget.size || "1x1"}
                    position={widget.position}
                    dimensions={{ w: width, h: height }}
                    breakpoint="lg"
                  >
                    {renderWidgetContent(widget, clientsData)}
                  </WidgetGridProvider>
                </div>

                {globalDebug && (
                  <div className="absolute left-2 top-2 rounded bg-black/50 p-2 text-xs text-white">
                    {widget._key} ({widget.position.row},{" "}
                    {widget.position.column}) - {widget.size}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    // </div>
  );
};
