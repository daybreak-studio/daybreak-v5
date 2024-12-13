import { useViewport } from "@/hooks/useViewport";
import { useWidgetData } from "@/contexts/WidgetDataContext";
import { Widget } from "./types";
import Twitter from "../variants/twitter";
import Media from "../variants/media";
import Project from "../variants/project";

const WIDGETS: Record<Widget["_type"], React.ComponentType<any>> = {
  twitterWidget: Twitter,
  mediaWidget: Media,
  projectWidget: Project,
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

  return (
    <div className="hide-scrollbar relative flex w-full overflow-x-auto before:flex-1 after:flex-1">
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
