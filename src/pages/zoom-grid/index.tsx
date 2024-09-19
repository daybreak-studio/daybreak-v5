import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const GRID_SIZE = 2;
const SQUARE_SIZE = 200;
const SCALE_FACTOR = 2.5;
const GAP_SIZE = 24;

const GridView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  const scale = useMotionValue(1);
  const originX = useMotionValue(0.5);
  const originY = useMotionValue(0.5);

  const totalGap = GAP_SIZE * (GRID_SIZE - 1);
  const gridSizePx = GRID_SIZE * SQUARE_SIZE + totalGap;

  // Update container dimensions
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateContainerSize();

    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  const handleSquareClick = (index: number) => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    setFocusedIndex(index);

    const col = index % GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);

    // Calculate the position of the square center relative to the grid
    const squareCenterX = col * (SQUARE_SIZE + GAP_SIZE) + SQUARE_SIZE / 2;
    const squareCenterY = row * (SQUARE_SIZE + GAP_SIZE) + SQUARE_SIZE / 2;

    // Since the grid is centered in the container, calculate the originX and originY relative to the grid center
    const originXValue = (squareCenterX - gridSizePx / 2) / gridSizePx + 0.5;
    const originYValue = (squareCenterY - gridSizePx / 2) / gridSizePx + 0.5;

    animate(originX, originXValue, {
      type: "spring",
      stiffness: 150,
      damping: 20,
    });
    animate(originY, originYValue, {
      type: "spring",
      stiffness: 150,
      damping: 20,
    });
    animate(scale, SCALE_FACTOR, {
      type: "spring",
      stiffness: 150,
      damping: 20,
    });
  };

  const handleDragEnd = () => {
    // Implement drag-end logic if necessary
    // For this approach, you may need to adjust the implementation to handle dragging
  };

  useEffect(() => {
    if (focusedIndex === null) {
      animate(scale, 1, { type: "spring", stiffness: 150, damping: 20 });
      animate(originX, 0.5, { type: "spring", stiffness: 150, damping: 20 });
      animate(originY, 0.5, { type: "spring", stiffness: 150, damping: 20 });
    }
  }, [focusedIndex]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col items-center justify-center overflow-hidden align-middle"
      style={{ position: "relative" }}
    >
      <h1>Zoom Grid</h1>
      <div
        style={{
          display: "flex",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <motion.div
          style={{
            scale,
            originX,
            originY,
            width: gridSizePx,
            height: gridSizePx,
            cursor: "grab",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          drag
          dragElastic={0.2}
          dragConstraints={{
            left: -gridSizePx * (SCALE_FACTOR - 1) * originX.get(),
            right: gridSizePx * (SCALE_FACTOR - 1) * (1 - originX.get()),
            top: -gridSizePx * (SCALE_FACTOR - 1) * originY.get(),
            bottom: gridSizePx * (SCALE_FACTOR - 1) * (1 - originY.get()),
          }}
          onDragEnd={handleDragEnd}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${SQUARE_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${SQUARE_SIZE}px)`,
              gap: `${GAP_SIZE}px`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => (
              <motion.div
                key={index}
                onClick={() => handleSquareClick(index)}
                style={{
                  width: SQUARE_SIZE,
                  height: SQUARE_SIZE,
                  backgroundColor:
                    index === focusedIndex ? "#e74c3c" : "#3498db",
                  border: "1px solid #fff",
                  boxSizing: "border-box",
                }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GridView;
