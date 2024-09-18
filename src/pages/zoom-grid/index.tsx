import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const GRID_SIZE = 2; // 2x2 grid
const SQUARE_SIZE = 200; // Size of each square in pixels
const SCALE_FACTOR = 2.5; // Zoom scale
const GAP_SIZE = 20; // Gap between squares in pixels

const GridView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Total size of the grid including gaps
  const totalGap = GAP_SIZE * (GRID_SIZE - 1);
  const gridSizePx = GRID_SIZE * SQUARE_SIZE + totalGap;

  const handleSquareClick = (index: number) => {
    setFocusedIndex(index);

    const col = index % GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);

    // Calculate the position of the square's center
    const squareCenterX = col * (SQUARE_SIZE + GAP_SIZE) + SQUARE_SIZE / 2;
    const squareCenterY = row * (SQUARE_SIZE + GAP_SIZE) + SQUARE_SIZE / 2;

    const targetScale = SCALE_FACTOR;

    // Calculate the target x and y to center the square
    const targetX = window.innerWidth / 2 - squareCenterX * targetScale;
    const targetY = window.innerHeight / 2 - squareCenterY * targetScale;

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

    // Calculate the center point in the grid coordinate system
    const centerXInGrid = (window.innerWidth / 2 - currentX) / currentScale;
    const centerYInGrid = (window.innerHeight / 2 - currentY) / currentScale;

    // Determine the column and row of the square closest to the center point
    const col = Math.round(
      (centerXInGrid - SQUARE_SIZE / 2) / (SQUARE_SIZE + GAP_SIZE),
    );
    const row = Math.round(
      (centerYInGrid - SQUARE_SIZE / 2) / (SQUARE_SIZE + GAP_SIZE),
    );

    const clampedCol = Math.max(0, Math.min(col, GRID_SIZE - 1));
    const clampedRow = Math.max(0, Math.min(row, GRID_SIZE - 1));

    const index = clampedRow * GRID_SIZE + clampedCol;
    setFocusedIndex(index);

    handleSquareClick(index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (focusedIndex !== null) {
        handleSquareClick(focusedIndex);
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

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          x,
          y,
          cursor: "grab",
          position: "absolute",
          width: "100%",
          height: "100%",
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
            transformOrigin: "top left",
            width: gridSizePx,
            height: gridSizePx,
          }}
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
      </motion.div>
    </div>
  );
};

export default GridView;
