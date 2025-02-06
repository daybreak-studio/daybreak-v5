import { Clients } from "@/sanity/types";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface WorksGridProps {
  data: Clients[];
  children: (client: Clients, index: number) => React.ReactNode;
}

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
    transition: {
      duration: 0.5,
    },
  },
};

const WIDTHS = {
  // Desktop widths
  standard: "w-[400px]",
  hero: {
    side: "w-[360px]",
    middle: "w-[520px]",
  },
  // Mobile widths with 2:1 ratio
  mobile: {
    small: "block w-4/12 ", // 1/3 width
    large: "block w-8/12 ", // 2/3 width
  },
} as const;

const WorksGrid: React.FC<WorksGridProps> = ({ data = [], children }) => {
  // Desktop layout rows
  const desktopRows = useMemo(() => {
    if (!data || !data.length) return [];

    const result: Clients[][] = [];
    let currentIndex = 0;

    // First row is always 3 items, but swap first two items
    const firstThree = data.slice(0, 3);
    if (firstThree.length === 3) {
      // Create a new array with first two items swapped
      result.push([firstThree[1], firstThree[0], firstThree[2]]);
      currentIndex = 3;
    }

    // Process remaining items in alternating 2-3 pattern
    while (currentIndex < data.length) {
      const isThreeItemRow = result.length % 2 === 0;
      const itemsInRow = isThreeItemRow ? 3 : 2;
      const nextRow = data.slice(currentIndex, currentIndex + itemsInRow);

      if (nextRow.length === itemsInRow) {
        result.push(nextRow);
      }
      currentIndex += itemsInRow;
    }

    return result;
  }, [data]);

  // Simplified mobile rows logic
  const mobileRows = useMemo(() => {
    if (!data || !data.length) return [];

    const result: Clients[][] = [];
    for (let i = 0; i < data.length; i += 2) {
      const pair = data.slice(i, i + 2);
      if (pair.length === 2) {
        result.push(pair);
      }
    }
    return result;
  }, [data]);

  return (
    <div className="relative mx-auto pt-24">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        {/* Mobile Layout */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CONTAINER_ANIMATION}
          className="flex flex-col gap-4 md:hidden"
        >
          {mobileRows.map((row, rowIndex) => {
            const isEvenRow = rowIndex % 2 === 0;

            return (
              <div
                key={rowIndex}
                className={`flex justify-center gap-2 ${
                  isEvenRow ? "items-end" : "items-start"
                }`}
              >
                {row.map((client, index) => (
                  <motion.div
                    key={client._id}
                    variants={ITEM_ANIMATION}
                    className={
                      isEvenRow
                        ? index === 0
                          ? WIDTHS.mobile.large
                          : WIDTHS.mobile.small
                        : index === 0
                          ? WIDTHS.mobile.small
                          : WIDTHS.mobile.large
                    }
                  >
                    {children(client, rowIndex)}
                  </motion.div>
                ))}
              </div>
            );
          })}
        </motion.div>

        {/* Desktop Layout */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CONTAINER_ANIMATION}
          className="hidden md:flex md:flex-col md:gap-8"
        >
          {desktopRows.map((row, rowIndex) => {
            const isFirstRow = rowIndex === 0;
            const isLastRow = rowIndex === desktopRows.length - 1;
            const isHeroRow = isFirstRow || (isLastRow && row.length === 3);

            return (
              <div
                key={rowIndex}
                className={`flex justify-center gap-4 ${
                  isFirstRow
                    ? "items-end"
                    : isLastRow
                      ? "items-start"
                      : "items-center"
                }`}
              >
                {row.map((client, index) => (
                  <motion.div
                    key={client._id}
                    variants={ITEM_ANIMATION}
                    className={
                      isHeroRow
                        ? index === 1
                          ? WIDTHS.hero.middle
                          : WIDTHS.hero.side
                        : WIDTHS.standard
                    }
                  >
                    {children(client, rowIndex)}
                  </motion.div>
                ))}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default WorksGrid;
