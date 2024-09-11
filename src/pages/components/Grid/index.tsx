import GridLayout from "react-grid-layout";

import {
  useBreakpoint,
  WidgetGridContext,
} from "@/pages/components/grid/hooks";
import { Defaults, GridProps } from "@/pages/components/grid/props";

export const WidgetGridProvider: React.FC<GridProps.Provider> = ({
  size,
  id,
  position,
  children,
}) => {
  return (
    <WidgetGridContext.Provider value={{ size, id, position }}>
      {children}
    </WidgetGridContext.Provider>
  );
};

export const WidgetGrid: React.FC<GridProps.Layout> = ({ layout }) => {
  const breakpoints: GridProps.Settings = {
    lg: { rowHeight: 178, margin: [32, 32] },
    sm: { rowHeight: 103, margin: [12, 12] },
  };
  const breakpoint = useBreakpoint() as keyof typeof breakpoints;
  const settings = breakpoints[breakpoint];
  const cols = Math.max(
    ...layout.map((item) => item.position.x + item.size.w),
    0,
  );
  const width = cols * settings.rowHeight + (cols - 1) * settings.margin[1];

  const Structure: GridProps.Structure = {
    cols,
    width,
    rowHeight: settings.rowHeight,
    margin: settings.margin,
    ...Defaults.Structure,
  };

  return (
    <div className="relative h-screen w-screen">
      <div
        style={{ width: `${width}px` }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      >
        <GridLayout {...Structure} cols={Structure.cols}>
          {layout.map((item) => (
            <div
              key={item.id}
              data-grid={{
                i: item.id,
                x: item.position.x,
                y: item.position.y,
                w: item.size.w,
                h: item.size.h,
                ...Defaults.DataGridAttributes,
              }}
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border font-semibold shadow">
                <WidgetGridProvider
                  id={item.id}
                  size={item.size}
                  position={item.position}
                >
                  {item.content}
                </WidgetGridProvider>
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};
