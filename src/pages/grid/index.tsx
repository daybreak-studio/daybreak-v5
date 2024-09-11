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
      position: { x: 1, y: 0 },
      size: { w: 1, h: 1 },
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
      content: <ExampleWidget />,
    },
  ];

  return <WidgetGrid layout={layout} />;
}

interface ExampleWidgetProps {
  seed?: string;
}

const ExampleWidget = ({ seed = uuid() }: ExampleWidgetProps) => {
  const { size } = useWidgetGridContext();
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <img
        src={`https://avatar.vercel.sh/${encodeURIComponent(seed)}`}
        className="absolute h-full w-full object-cover opacity-5"
      />
      {size.w}x{size.h}
    </div>
  );
};
