import React from "react";
import GridLayout from "react-grid-layout";

type LayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
};

type GridLayoutProps = {
  layout: LayoutItem[];
  size: number;
  margin: [number, number];
};

const GridLayoutComponent: React.FC<GridLayoutProps> = ({
  layout,
  size,
  margin,
}) => {
  const columns = Math.max(...layout.map((item) => item.x + item.w), 0);
  const width = columns * size + (columns - 1) * margin[0];

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div style={{ width: `${width}px` }}>
        <GridLayout
          margin={margin}
          rowHeight={size}
          cols={columns}
          width={width}
        >
          {layout.map((item) => (
            <div key={item.i} data-grid={item}>
              <div className="flex h-full w-full items-center justify-center rounded-2xl border p-2 text-gray-400 shadow">
                {item.i}
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};

export default GridLayoutComponent;
