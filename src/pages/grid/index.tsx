"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import { useWindowWidth } from "../components/Grid";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Example() {
  const gridItemProps = {
    className:
      "flex items-center rounded-2xl justify-center border p-2 h-full w-full",
  };

  const ExampleLayout = () => [
    { i: "1", x: 0, y: 0, w: 3, h: 3, static: true },
    { i: "2", x: 3, y: 0, w: 2, h: 2, static: true },
    { i: "3", x: 3, y: 2, w: 1, h: 1, static: true },
    { i: "4", x: 4, y: 2, w: 1, h: 1, static: true },
  ];

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[1016px]">
        <GridLayout
          margin={[32, 32]}
          autoSize={true}
          containerPadding={[0, 0]}
          rowHeight={178}
          cols={5}
          width={1016}
        >
          {ExampleLayout().map((item) => (
            <div key={item.i} data-grid={item}>
              <div {...gridItemProps}>{item.i}</div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
