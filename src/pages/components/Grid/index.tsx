import GridLayout from "react-grid-layout";
import { WidgetGridContext } from "@/pages/components/grid/hooks";
import { Defaults, GridProps } from "@/pages/components/grid/props";

export const WidgetGridProvider: React.FC<GridProps.Provider> = ({
  size,
  children,
}) => {
  return (
    <WidgetGridContext.Provider value={{ size }}>
      {children}
    </WidgetGridContext.Provider>
  );
};

export const WidgetGrid: React.FC<GridProps.Layout> = ({ layout }) => {
  const cols = Math.max(
    ...layout.map((item) => item.position.x + item.size.w),
    0,
  );

  const width = cols * 178 + (cols - 1) * 32;

  const Structure: GridProps.Structure = {
    cols,
    width,
    ...Defaults.Structure,
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
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
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border text-gray-400 shadow">
                <WidgetGridProvider size={item.size}>
                  {/* Wrap the widget in the provider */}
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
