"use client";

import React from "react";

import { WidgetGrid } from "@/pages/(components)/grid";
import { LayoutProps } from "@/pages/(components)/grid/props";
import { useWidgetGridContext } from "@/pages/(components)/grid/hooks";

export default function Example() {
  const layout: LayoutProps.Item[] = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      size: { w: 2, h: 1 },
      content: <Twitter />,
    },
    {
      id: "2",
      position: { x: 0, y: 1 },
      size: { w: 2, h: 2 },
      content: "",
    },
    {
      id: "3",
      position: { x: 2, y: 0 },
      size: { w: 3, h: 3 },
      content: "",
    },
    {
      id: "4",
      position: { x: 5, y: 0 },
      size: { w: 2, h: 2 },
      content: "",
    },
    {
      id: "5",
      position: { x: 5, y: 2 },
      size: { w: 1, h: 1 },
      content: "",
    },
  ];

  return <WidgetGrid layout={layout} debug />;
}

const Twitter = () => {
  const { size } = useWidgetGridContext();
  return (
    <div>
      <h1>Twitter {size.w}</h1>
    </div>
  );
};
