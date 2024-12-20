import { cn } from "@/lib/utils";
import { HoverCard } from "@/components/animations/hover";

function ensurePosition(
  position: { row?: number; column?: number } | undefined,
) {
  return {
    row: position?.row ?? 1,
    column: position?.column ?? 1,
  };
}

interface BaseWidgetProps {
  position: {
    row: number;
    column: number;
  };
  size: "1x1" | "2x2" | "3x3" | undefined;
  children: React.ReactNode;
  className?: string;
}

export function BaseWidget({
  position: rawPosition,
  size,
  children,
  className,
}: Omit<BaseWidgetProps, "position"> & {
  position: { row?: number; column?: number } | undefined;
}) {
  const position = ensurePosition(rawPosition);

  const getSpanSize = (size: BaseWidgetProps["size"]) => {
    switch (size) {
      case "1x1":
        return 1;
      case "2x2":
        return 2;
      case "3x3":
        return 3;
      default:
        return 1;
    }
  };

  const span = getSpanSize(size);

  return (
    <HoverCard
      className={cn("frame-outer", className)}
      style={{
        gridColumn: `${position.column} / span ${span}`,
        gridRow: `${position.row} / span ${span}`,
      }}
    >
      <div className="frame-inner relative overflow-hidden">{children}</div>
    </HoverCard>
  );
}
