interface GridItem {
  width: number;
  height: number;
  content: React.ReactNode;
}

interface ZoomGridProps {
  items: GridItem[];
  scaleFactor?: number;
  gapSize?: number;
}

interface ZoomContextValue {
  isZoomedIn: boolean;
}
