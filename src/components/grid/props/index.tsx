import { ReactGridLayoutProps } from "react-grid-layout";

export type Dimensions = { w: number; h: number };
export type Position = {
  row: number;
  column: number;
};

export namespace LayoutProps {
  export type Item = {
    id: string;
    position: Position;
    size: string;
    dimensions: Dimensions;
    content: React.ReactNode;
  };
}

export namespace GridProps {
  export interface Context {
    id: string;
    position: Position;
    size: string;
    dimensions: Dimensions;
    breakpoint: string;
  }

  export interface Provider {
    id: string;
    position: Position;
    size: string;
    dimensions: Dimensions;
    children: React.ReactNode;
    breakpoint: string;
  }

  export interface Layout {
    header?: React.ReactNode;
    heading?: string;
    layout: LayoutProps.Item[];
    debug?: boolean;
  }

  export interface Settings {
    xl: { rowHeight: number; margin: [number, number] };
    lg: { rowHeight: number; margin: [number, number] };
    md: { rowHeight: number; margin: [number, number] };
    sm: { rowHeight: number; margin: [number, number] };
  }

  export interface Structure extends ReactGridLayoutProps {
    cols: number;
    width: number;
  }

  export interface Widget {
    id: string;
    position: Position;
    size: string;

    dimensions: Dimensions;
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
    containerPadding: [0, 0],
  };

  export const DataGridAttributes: GridProps.DataGridAttributes = {
    static: true,
    isBounded: false,
    isDraggable: false,
    isResizable: false,
  };
}
