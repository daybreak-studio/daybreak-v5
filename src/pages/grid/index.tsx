"use client";

import React from "react";
import GridLayoutComponent from "../components/Grid";

export default function Example() {
  const layout = [
    { i: "1", x: 0, y: 1, w: 2, h: 2, static: true },
    { i: "2", x: 1, y: 0, w: 1, h: 1, static: true },
    { i: "3", x: 2, y: 0, w: 3, h: 3, static: true },
    { i: "4", x: 5, y: 0, w: 2, h: 2, static: true },
    { i: "5", x: 5, y: 2, w: 1, h: 1, static: true },
  ];

  const size = 178;
  const margin: [number, number] = [32, 32];

  return <GridLayoutComponent layout={layout} size={size} margin={margin} />;
}
