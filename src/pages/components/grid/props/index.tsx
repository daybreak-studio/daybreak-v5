import { ReactGridLayoutProps } from "react-grid-layout";

export type Size = { w: number; h: number };
export type Position = { x: number; y: number };

export namespace LayoutProps {
  export type Item = {
    id: string;
    position: Position;
    size: Size;
    content: React.ReactNode;
  };
}

export namespace GridProps {
  export interface Context {
    size: { w: number; h: number };
  }

  export interface Provider {
    size: { w: number; h: number };
    children: React.ReactNode;
  }

  export interface Layout {
    layout: LayoutProps.Item[];
  }

  export interface Structure extends ReactGridLayoutProps {
    cols: number;
    width: number;
  }

  export interface Widget {
    id: string;
    position: Position;
    size: Size;
    content: React.ReactNode;
  }

  export interface DataGridAttributes {
    i?: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isBounded?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    resizeHandles?: Array<"s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne">;
  }
}

export namespace Defaults {
  export const Structure: ReactGridLayoutProps = {
    margin: [32, 32],
    rowHeight: 178,
    containerPadding: [0, 0],
  };

  export const DataGridAttributes: GridProps.DataGridAttributes = {
    static: true,
    isBounded: false,
    isDraggable: false,
    isResizable: false,
  };
}
