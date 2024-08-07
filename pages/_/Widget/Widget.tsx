import clsx from "clsx";
import React, { PropsWithChildren, useMemo } from "react";

// sm = 1x1
// md = 2x2
// lg = 3x3

export type WidgetSize = "sm" | "md" | "lg";
export type WidgetPosition = {
  col: number;
  row: number;
};
export type WidgetLayout = {
  narrow: WidgetPosition;
  wide: WidgetPosition;
};
export type WidgetProps = {
  size: WidgetSize;
  position: WidgetLayout;
};

const Widget = ({
  children,
  size,
  position,
}: PropsWithChildren<WidgetProps>) => {
  const colSpanStyle = useMemo(() => {
    switch (size) {
      case "sm":
        return `col-span-1`;
      case "md":
        return `col-span-2`;
      case "lg":
        return `col-span-3`;
    }
  }, [size]);

  const rowSpanStyle = useMemo(() => {
    switch (size) {
      case "sm":
        return `row-span-1`;
      case "md":
        return `row-span-2`;
      case "lg":
        return `row-span-3`;
    }
  }, [size]);

  const colStartStyle = `col-start-1 narrow:col-start-${position.narrow.col + 2} wide:col-start-${position.wide.col + 2}`;
  const rowStartStyle = `narrow:row-start-${position.narrow.row + 1} wide:row-start-${position.wide.row + 1}`;

  return (
    <div
      className={clsx(
        "bg-gray-100 aspect-square rounded-lg",
        rowSpanStyle,
        colStartStyle,
        rowStartStyle,
        colSpanStyle,
      )}
    >
      {children}
    </div>
  );
};

export default Widget;
