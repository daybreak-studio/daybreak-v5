import { v4 as uuid } from "uuid";
import { ReactGridLayoutProps } from "react-grid-layout";

interface GridWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  /*
   * attributes
   */
  key?: string;
  size: "small" | "medium" | "large";

  /*
   * data-* attributes
   */
  i?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  resizeHandles?: Array<"s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne">;
  isBounded?: boolean;
}

const DefaultGridLayoutProps: ReactGridLayoutProps = {
  autoSize: true,
  isBounded: false,
  isDraggable: false,
  isResizable: false,
  isDroppable: false,
  // margin: [0, 0],
  rowHeight: 100,
  cols: 9,
};

const DefaultGridItemProps: GridWidgetProps = {
  /*
   * attributes
   */
  size: "small",

  /*
   * data-* attributes
   */
  w: 1,
  h: 1,
  static: true,
  isDraggable: false,
  isResizable: false,
  isBounded: false,
  x: 0,
  y: 0,
};

export { DefaultGridLayoutProps, DefaultGridItemProps };
export type { GridWidgetProps };
