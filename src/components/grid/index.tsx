import { useDebug } from "@/contexts/DebugContext";
import useEmblaCarousel from "embla-carousel-react";
import { useScramble } from "use-scramble";
import { WidgetGridContext } from "./hooks";
import { GridProps } from "./props";
import clsx from "clsx";
import Twitter from "@/components/widgets/twitter";
import Media from "@/components/widgets/media";
import Project from "@/components/widgets/project";
import type { Home, Clients } from "@/sanity/types";

// Define widget size constants and types
const WIDGET_SIZES = {
  "1x1": { width: 1, height: 1 },
  "2x2": { width: 2, height: 2 },
  "3x3": { width: 3, height: 3 },
} as const;

type WidgetSize = keyof typeof WIDGET_SIZES;

// Grid constants
const GRID_CONFIG = {
  CELL_SIZE: 160,
  GAP: 32,
  COLUMNS: 7,
  ROWS: 3,
} as const;

type Widget = NonNullable<Home["widgets"]>[number];

interface WidgetGridProps {
  header?: React.ReactNode;
  heading?: string;
  widgets: Widget[];
  clientsData: Clients[];
  debug?: boolean;
}

// Provider Component
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

// Helper functions
const getWidgetDimensions = (size: WidgetSize | undefined) => {
  return WIDGET_SIZES[size || "1x1"];
};

const getGridPosition = (position: { x?: number; y?: number } | undefined) => {
  return {
    x: position?.x ?? 0,
    y: position?.y ?? 0,
  };
};

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

// Main Component
export const WidgetGrid = ({
  header,
  heading,
  widgets,
  clientsData,
  debug,
}: WidgetGridProps) => {
  const { debug: globalDebug } = useDebug();
  const [emblaRef] = useEmblaCarousel();
  const { ref, replay } = useScramble({
    text: heading,
    speed: 1,
    playOnMount: false,
  });

  if (!widgets?.length) return null;

  return (
    <div className="relative h-screen w-screen">
      <div className="flex h-full w-full flex-col items-center justify-center">
        {header || (
          <h1
            ref={ref}
            onMouseOver={replay}
            onFocus={replay}
            className="mb-4 text-center text-4xl font-[450] text-zinc-400"
          >
            {heading}
          </h1>
        )}

        <div
          className="grid w-screen items-center justify-center overflow-x-scroll"
          style={{
            gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, ${GRID_CONFIG.CELL_SIZE}px)`,
            gridAutoRows: `${GRID_CONFIG.CELL_SIZE}px`,
            gap: `${GRID_CONFIG.GAP}px`,
            padding: `${GRID_CONFIG.GAP}px`,
          }}
        >
          {widgets.map((widget) => {
            const { width, height } = getWidgetDimensions(
              widget.size as WidgetSize,
            );
            const position = getGridPosition(widget.position);

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
                  gridColumn: `${position.x + 1} / span ${width}`,
                  gridRow: `${position.y + 1} / span ${height}`,
                  aspectRatio: "1 / 1",
                }}
              >
                <div className="h-full w-full">
                  <WidgetGridProvider
                    id={widget._key || ""}
                    size={widget.size || "1x1"}
                    position={position}
                    dimensions={{ w: width, h: height }}
                    breakpoint="lg"
                  >
                    {renderWidgetContent(widget, clientsData)}
                  </WidgetGridProvider>
                </div>

                {globalDebug && (
                  <div className="absolute left-2 top-2 rounded bg-black/50 p-2 text-xs text-white">
                    {widget._key} ({position.x}, {position.y}) - {widget.size}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
