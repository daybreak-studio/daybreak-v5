"use client";

import React from "react";
import { v4 as uuid } from "uuid";
import { WidgetGrid } from "@/pages/components/grid";
import { LayoutProps } from "@/pages/components/grid/props";
import { useWidgetGridContext } from "@/pages/components/grid/hooks";

export default function Example() {
  const layout: LayoutProps.Item[] = [
    {
      id: "1",
      position: { x: 3, y: 0 },
      size: { w: 2, h: 1 },
      content: <ExampleWidget />,
    },
    {
      id: "2",
      position: { x: 0, y: 1 },
      size: { w: 2, h: 2 },
      content: <ExampleWidget />,
    },
    {
      id: "3",
      position: { x: 2, y: 0 },
      size: { w: 3, h: 3 },
      content: <ExampleWidget />,
    },
    {
      id: "4",
      position: { x: 5, y: 0 },
      size: { w: 2, h: 2 },
      content: <ExampleWidget />,
    },
    {
      id: "5",
      position: { x: 5, y: 2 },
      size: { w: 1, h: 1 },
      content: "dhfjdksahfkjldshfkjdashfkljds",
    },
  ];

  return <WidgetGrid layout={layout} />;
}

const ExampleWidget = () => {
  const { id, size, position } = useWidgetGridContext();
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400">
      <div>Key: {id}</div>
      <div>
        Size: {size.w} x {size.h}
      </div>
      <div>
        Position: x:{position.x}, y:{position.y}
      </div>
    </div>
  );
};
