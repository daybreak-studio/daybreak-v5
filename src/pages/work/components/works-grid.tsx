import { Clients } from "@/sanity/types";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface WorksGridProps {
  data: Clients[];
  children: (client: Clients, index: number) => React.ReactNode;
}

const GRID_ANIMATION = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const WIDTHS = {
  // Desktop widths
  standard: "hidden md:block md:w-[400px]",
  hero: {
    side: "hidden md:block md:w-[360px]",
    middle: "hidden md:block md:w-[520px]",
  },
  // Mobile widths with 2:1 ratio
  mobile: {
    small: "block w-4/12 md:hidden", // 1/3 width
    large: "block w-8/12 md:hidden", // 2/3 width
  },
} as const;

const WorksGrid: React.FC<WorksGridProps> = ({ data, children }) => {
  // Desktop layout rows
  const desktopRows = useMemo(() => {
    const result: Clients[][] = [];
    let currentIndex = 0;

    // First row is always 3 items
    result.push(data.slice(0, 3));
    currentIndex = 3;

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={GRID_ANIMATION}
      className="relative mx-auto pt-24"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 md:hidden">
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
                  <div
                    key={client._id}
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
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-col md:gap-8">
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
                  <div
                    key={client._id}
                    className={
                      isHeroRow
                        ? index === 1
                          ? WIDTHS.hero.middle
                          : WIDTHS.hero.side
                        : WIDTHS.standard
                    }
                  >
                    {children(client, rowIndex)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default WorksGrid;
