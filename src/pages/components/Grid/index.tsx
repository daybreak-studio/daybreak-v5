import * as React from "react";

import GridLayout, { ReactGridLayoutProps } from "react-grid-layout";

import { GridWidgetProps } from "./grid.props";
import { useState, useEffect } from "react";

export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? Math.min(window.innerWidth, 1280) : 1280,
  );

  useEffect(() => {
    function handleResize() {
      setWidth(Math.min(window.innerWidth, 1280));
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export const Layout: React.FC<ReactGridLayoutProps> = ({ ...props }) => {
  return (
    <GridLayout
      cols={5}
      rowHeight={598}
      autoSize={true}
      isBounded={false}
      isDraggable={false}
      isResizable={false}
      isDroppable={false}
      className="h-screen w-screen border"
      margin={[32, 32]}
    >
      {props.children}
    </GridLayout>
  );
};

export const Widget = React.forwardRef<HTMLDivElement, GridWidgetProps>(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-grid={{
          x: props.x,
          y: props.y,
          w: props.size === "small" ? 1 : props.size === "medium" ? 2 : 3,
          h: props.size === "small" ? 1 : props.size === "medium" ? 2 : 3,
          static: true,
          isDraggable: false,
          isResizable: false,
          isBounded: false,
        }}
        style={{ ...style }}
        className={className}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>
    );
  },
);

Widget.displayName = "Widget";
