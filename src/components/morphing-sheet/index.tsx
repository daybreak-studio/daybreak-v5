import { motion } from "framer-motion";
import React, { forwardRef, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";

type Props = {
  children: React.ReactNode;
  rounded?: number;
  withBorder?: boolean;
};

const MorphingSheet = forwardRef<HTMLDivElement, Props>(
  ({ withBorder, rounded = 24, children }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { width = 0, height = 0 } = useResizeObserver({
      ref: contentRef,
      box: "border-box",
    });
    return (
      <motion.div
        animate={{
          padding: withBorder ? "6px" : 0,
          borderRadius: rounded,
        }}
        ref={ref}
        className="mx-auto h-min w-min overflow-hidden bg-white bg-opacity-60 text-black drop-shadow-2xl backdrop-blur-2xl"
      >
        <motion.div
          className="relative bg-white"
          animate={{
            borderRadius: withBorder ? rounded - 4 : rounded,
            width: width,
            height: height,
          }}
        >
          <div ref={contentRef} className="absolute flex">
            {children}
          </div>
        </motion.div>
      </motion.div>
    );
  },
);

MorphingSheet.displayName = "MorphingSheet";

export default MorphingSheet;
