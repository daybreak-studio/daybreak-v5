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
  standard: "w-[400px]",
  hero: {
    side: "w-[360px]",
    middle: "w-[520px]",
  },
} as const;

const WorksGrid: React.FC<WorksGridProps> = ({ data, children }) => {
  const rows = useMemo(() => {
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={GRID_ANIMATION}
      className="relative mx-auto pt-24"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        {rows.map((row, rowIndex) => {
          const isFirstRow = rowIndex === 0;
          const isLastRow = rowIndex === rows.length - 1;
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
    </motion.div>
  );
};

export default WorksGrid;
