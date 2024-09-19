import GridLayout from "react-grid-layout";

import { useBreakpoint, WidgetGridContext } from "@/components/grid/hooks";
import { Defaults, GridProps } from "@/components/grid/props";
import clsx from "clsx";

export const WidgetGridProvider: React.FC<GridProps.Provider> = ({
  size,
  id,
  position,
  children,
  breakpoint,
}) => {
  return (
    <WidgetGridContext.Provider value={{ size, id, position, breakpoint }}>
      {children}
    </WidgetGridContext.Provider>
  );
};

export const WidgetGrid: React.FC<GridProps.Layout> = ({
  header,
  layout,
  debug,
}) => {
  const breakpoints: GridProps.Settings = {
    xl: { rowHeight: 178, margin: [32, 32] },
    lg: { rowHeight: 96, margin: [16, 16] },
    md: { rowHeight: 118, margin: [22, 22] },
    sm: { rowHeight: 109, margin: [19, 19] },
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
    <div className="relative h-screen w-screen transition-all">
      <div className="flex h-full w-full flex-col items-center justify-center gap-12">
        {header ? (
          header
        ) : (
          <h1 className="text w-80 text-center text-4xl">
            A technology first design studio.
          </h1>
        )}
        <div style={{ width: `${width}px` }}>
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
                <div
                  className={clsx({
                    ["border-2 border-orange-500"]: debug,
                    ["flex h-full w-full overflow-hidden"]: true,
                  })}
                >
                  <WidgetGridProvider
                    id={item.id}
                    size={item.size}
                    position={item.position}
                    breakpoint={breakpoint}
                  >
                    {item.content}
                  </WidgetGridProvider>
                  {debug && (
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 p-1 text-xs uppercase text-white">
                      ID: {item.id}
                      <br /> Size: {item.size.w}x{item.size.h}
                      <br />
                      Position: x: {item.position.x} y:{item.position.y}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </GridLayout>
        </div>
      </div>
    </div>
  );
};
