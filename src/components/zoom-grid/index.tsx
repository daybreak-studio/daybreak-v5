import React, { useState, useRef, useEffect, createContext } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export const ZoomContext = createContext<ZoomContextValue>({
  isZoomedIn: false,
});

const ZoomGrid: React.FC<ZoomGridProps> = ({
  items,
  scaleFactor = 2.5,
  gapSize = 20,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const gridItems = items;

  const GRID_SIZE = Math.ceil(Math.sqrt(gridItems.length));

  const itemPositions = gridItems.map((item, index) => {
    const col = index % GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);

    const xPos = gridItems
      .slice(row * GRID_SIZE, row * GRID_SIZE + col)
      .reduce((acc, curr) => acc + curr.width + gapSize, 0);

    const yPos = gridItems.slice(0, row).reduce((acc, curr, idx) => {
      if (idx % GRID_SIZE === 0) {
        const rowHeights = gridItems
          .slice(idx, idx + GRID_SIZE)
          .map((item) => item.height);
        const maxHeight = Math.max(...rowHeights);
        return acc + maxHeight + gapSize;
      }
      return acc;
    }, 0);

    return { x: xPos, y: yPos };
  });

  const gridWidth =
    Math.max(
      ...gridItems.map((item, index) => itemPositions[index].x + item.width),
    ) + gapSize;

  const gridHeight =
    Math.max(
      ...gridItems.map((item, index) => itemPositions[index].y + item.height),
    ) + gapSize;

  const handleItemClick = (index: number) => {
    setFocusedIndex(index);

    const item = gridItems[index];
    const position = itemPositions[index];

    const itemCenterX = position.x + item.width / 2;
    const itemCenterY = position.y + item.height / 2;

    const targetScale = scaleFactor;

    const gridRect = ref.current?.getBoundingClientRect();

    if (!gridRect) return;

    const scaledItemCenterX =
      gridRect.left + itemCenterX * targetScale + x.get();
    const scaledItemCenterY =
      gridRect.top + itemCenterY * targetScale + y.get();

    const deltaX = window.innerWidth / 2 - scaledItemCenterX;
    const deltaY = window.innerHeight / 2 - scaledItemCenterY;

    const targetX = x.get() + deltaX;
    const targetY = y.get() + deltaY;

    animate(x, targetX, { type: "spring", stiffness: 150, damping: 20 });
    animate(y, targetY, { type: "spring", stiffness: 150, damping: 20 });
    animate(scale, targetScale, {
      type: "spring",
      stiffness: 150,
      damping: 20,
    });
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    const currentY = y.get();
    const currentScale = scale.get();

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    const gridRect = ref.current?.getBoundingClientRect();

    if (!gridRect) return;

    const gridX = (viewportCenterX - gridRect.left - currentX) / currentScale;
    const gridY = (viewportCenterY - gridRect.top - currentY) / currentScale;

    let foundIndex = null;
    for (let i = 0; i < gridItems.length; i++) {
      const item = gridItems[i];
      const position = itemPositions[i];
      const itemLeft = position.x;
      const itemTop = position.y;
      const itemRight = itemLeft + item.width;
      const itemBottom = itemTop + item.height;

      if (
        gridX >= itemLeft &&
        gridX <= itemRight &&
        gridY >= itemTop &&
        gridY <= itemBottom
      ) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== null) {
      setFocusedIndex(foundIndex);
      handleItemClick(foundIndex);
    } else {
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (focusedIndex !== null) {
        handleItemClick(focusedIndex);
      } else {
        animate(scale, 1, { type: "spring", stiffness: 150, damping: 20 });
        animate(x, 0, { type: "spring", stiffness: 150, damping: 20 });
        animate(y, 0, { type: "spring", stiffness: 150, damping: 20 });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [focusedIndex]);

  useEffect(() => {
    if (focusedIndex === null) {
      animate(scale, 1, { type: "spring", stiffness: 150, damping: 20 });
      animate(x, 0, { type: "spring", stiffness: 150, damping: 20 });
      animate(y, 0, { type: "spring", stiffness: 150, damping: 20 });
    }
  }, [focusedIndex]);

  const isZoomedIn = focusedIndex !== null;

  return (
    <div ref={ref} className="relative h-auto w-fit overflow-visible">
      {isZoomedIn && (
        <button
          onClick={() => setFocusedIndex(null)}
          className="text-violet11 hover:bg-mauve3 shadow-blackA4 fixed right-8 top-8 z-10 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none"
        >
          Close
        </button>
      )}

      <motion.div
        style={{
          x,
          y,
          cursor: "grab",
          width: gridWidth,
          height: gridHeight,
          position: "relative",
        }}
        drag
        dragElastic={0.2}
        dragConstraints={{
          left: -Infinity,
          right: Infinity,
          top: -Infinity,
          bottom: Infinity,
        }}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          style={{
            scale,
            transformOrigin: "0% 0%",
            width: gridWidth,
            height: gridHeight,
            position: "relative",
          }}
        >
          <ZoomContext.Provider value={{ isZoomedIn }}>
            {gridItems.map((item, index) => (
              <motion.div
                key={index}
                onClick={() => handleItemClick(index)}
                style={{
                  position: "absolute",
                  left: itemPositions[index].x,
                  top: itemPositions[index].y,
                  width: item.width,
                  height: item.height,
                  boxSizing: "border-box",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.content}
              </motion.div>
            ))}
          </ZoomContext.Provider>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ZoomGrid;
