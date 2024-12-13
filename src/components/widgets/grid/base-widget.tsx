import { cn } from "@/lib/utils";
import { WidgetSize } from "./types";

interface BaseWidgetProps {
  position: { row: number; column: number };
  size: WidgetSize;
  children: React.ReactNode;
  className?: string;
}

export function BaseWidget({
  position,
  size,
  children,
  className,
}: BaseWidgetProps) {
  const getSpanSize = (size: WidgetSize) => {
    switch (size) {
      case "1x1":
        return 1;
      case "2x2":
        return 2;
      case "3x3":
        return 3;
    }
  };

  const span = getSpanSize(size);

  return (
    <div
      className={cn("frame-outer relative overflow-hidden", className)}
      style={{
        gridColumn: `${position.column} / span ${span}`,
        gridRow: `${position.row} / span ${span}`,
      }}
    >
      {children}
    </div>
  );
}
