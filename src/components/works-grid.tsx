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
    standard: "w-[400px]",
    hero: {
      side: "w-[360px]",
      middle: "w-[520px]",
    },
  },
  mobile: {
    small: "block w-4/12", // 1/3 width
    large: "block w-8/12", // 2/3 width
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
  isDesktop: boolean;
  isAnimating: boolean;
  children: (client: Clients, index: number) => React.ReactNode;
}

function GridRow({
  row,
  rowIndex,
  totalRows,
  isDesktop,
  isAnimating,
  children,
}: RowProps) {
  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === totalRows - 1;
  const isHeroRow =
    isDesktop && (isFirstRow || (isLastRow && row.length === 3));

  return (
    <div
      className={cn(
        "flex justify-center",
        // Spacing
        isDesktop ? "gap-4" : "gap-2",
        // Alignment
        isDesktop
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
            // Mobile layout (default)
            index === (rowIndex % 2 === 0 ? 0 : 1)
              ? WIDTHS.mobile.large
              : WIDTHS.mobile.small,
            // Desktop layout
            isDesktop &&
              (isHeroRow
                ? index === 1
                  ? WIDTHS.desktop.hero.middle
                  : WIDTHS.desktop.hero.side
                : WIDTHS.desktop.standard),
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useIsomorphicLayoutEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const rows = useMemo(
    () => (isDesktop ? generateDesktopRows(data) : generateMobileRows(data)),
    [data, isDesktop],
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
            key={isDesktop ? "desktop" : "mobile"}
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
                isDesktop={isDesktop}
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
