import { Clients } from "@/sanity/types";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useMediaQuery, useIsomorphicLayoutEffect } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface WorksGridProps {
  data: Clients[];
  children: (client: Clients, index: number) => React.ReactNode;
}

// Animation variants
const CONTAINER_ANIMATION = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const ITEM_ANIMATION = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Grid layout constants
const WIDTHS = {
  desktop: {
    standard: "w-[clamp(280px,25vw,400px)]",
    hero: {
      side: "w-[clamp(260px,22vw,360px)]",
      middle: "w-[clamp(380px,35vw,520px)]",
    },
    gap: "gap-[clamp(12px,2vw,16px)]",
  },
  tablet: {
    standard: "w-[clamp(200px,20vw,280px)]",
    hero: {
      side: "w-[clamp(180px,18vw,260px)]",
      middle: "w-[clamp(280px,28vw,380px)]",
    },
    gap: "gap-[clamp(8px,1.5vw,12px)]",
  },
  mobile: {
    small: "w-4/12", // 1/3 width
    large: "w-8/12", // 2/3 width
    gap: "gap-2",
  },
} as const;

// Helper functions for row generation
function generateDesktopRows(data: Clients[]): Clients[][] {
  if (!data?.length) return [];

  const result: Clients[][] = [];
  let currentIndex = 0;

  // First row is always 3 items
  const firstThree = data.slice(0, 3);
  if (firstThree.length > 0) {
    result.push(firstThree);
    currentIndex = firstThree.length;
  }

  // Process remaining items in alternating 2-3 pattern
  while (currentIndex < data.length) {
    const isThreeItemRow = result.length % 2 === 0;
    const itemsInRow = isThreeItemRow ? 3 : 2;
    const nextRow = data.slice(currentIndex, currentIndex + itemsInRow);
    if (nextRow.length > 0) result.push(nextRow);
    currentIndex += itemsInRow;
  }

  return result;
}

function generateMobileRows(data: Clients[]): Clients[][] {
  if (!data?.length) return [];

  const result: Clients[][] = [];
  for (let i = 0; i < data.length; i += 2) {
    const pair = data.slice(i, i + 2);
    if (pair.length > 0) result.push(pair);
  }
  return result;
}

// Row component for better organization
interface RowProps {
  row: Clients[];
  rowIndex: number;
  totalRows: number;
  viewportSize: "desktop" | "tablet" | "mobile";
  isAnimating: boolean;
  children: (client: Clients, index: number) => React.ReactNode;
}

function GridRow({
  row,
  rowIndex,
  totalRows,
  viewportSize,
  isAnimating,
  children,
}: RowProps) {
  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === totalRows - 1;
  const isDesktopLayout =
    viewportSize === "desktop" || viewportSize === "tablet";
  const isHeroRow =
    isDesktopLayout && (isFirstRow || (isLastRow && row.length === 3));

  return (
    <div
      className={cn(
        "flex w-full justify-center",
        // Spacing based on viewport size
        WIDTHS[viewportSize].gap,
        // Alignment
        isDesktopLayout
          ? cn(
              "items-center",
              isFirstRow && "items-end",
              isLastRow && "items-start",
            )
          : isFirstRow
            ? "items-end"
            : "items-start",
      )}
    >
      {row.map((client, index) => (
        <motion.div
          key={client._id}
          variants={ITEM_ANIMATION}
          className={cn(
            // Mobile layout
            viewportSize === "mobile" &&
              (index === (rowIndex % 2 === 0 ? 0 : 1)
                ? WIDTHS.mobile.large
                : WIDTHS.mobile.small),
            // Desktop/Tablet layout
            isDesktopLayout &&
              (isHeroRow
                ? index === 1
                  ? WIDTHS[viewportSize].hero.middle
                  : WIDTHS[viewportSize].hero.side
                : WIDTHS[viewportSize].standard),
            // Disable pointer events during animation
            isAnimating && "pointer-events-none",
          )}
        >
          {children(client, rowIndex)}
        </motion.div>
      ))}
    </div>
  );
}

const WorksGrid: React.FC<WorksGridProps> = ({ data = [], children }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const viewportSize = isDesktop ? "desktop" : isTablet ? "tablet" : "mobile";

  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useIsomorphicLayoutEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const rows = useMemo(
    () =>
      viewportSize === "desktop" || viewportSize === "tablet"
        ? generateDesktopRows(data)
        : generateMobileRows(data),
    [data, viewportSize],
  );

  // Show empty container during SSR and initial layout calculation
  if (!isLayoutReady) {
    return (
      <div className="relative mx-auto pt-32">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
          <div className="flex flex-col gap-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto pt-32">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewportSize}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => setIsAnimating(false)}
            variants={CONTAINER_ANIMATION}
            className="flex flex-col gap-4"
          >
            {rows.map((row, rowIndex) => (
              <GridRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                totalRows={rows.length}
                viewportSize={viewportSize}
                isAnimating={isAnimating}
              >
                {children}
              </GridRow>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorksGrid;
