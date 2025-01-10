import { cn } from "@/lib/utils";
import { HoverCard } from "@/components/animations/hover";
import { motion } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";

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

  const MIN_DELAY = 0.2;
  const MAX_DELAY = 0.5;
  const randomDelay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.9,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 1,
        delay: randomDelay,
        ease: EASINGS.easeOutQuart,
      }}
      style={{
        gridColumn: `${position.column} / span ${span}`,
        gridRow: `${position.row} / span ${span}`,
        willChange: "transform",
      }}
    >
      <HoverCard className={cn("frame-outer", className)}>
        <div className="frame-inner relative h-full w-full overflow-hidden">
          {children}
        </div>
      </HoverCard>
    </motion.div>
  );
}
