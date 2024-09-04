import React, { forwardRef } from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onClick: () => void;
}

// eslint-disable-next-line react/display-name
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, position, onClick }, ref) => {
    let transformClasses = "";

    switch (position) {
      case "top-left":
        transformClasses =
          "-translate-x-[calc(100%+0.5rem)] -translate-y-[calc(100%+0.5rem)]";
        break;
      case "top-right":
        transformClasses =
          "translate-x-[0.5rem] -translate-y-[calc(100%+0.5rem)]";
        break;
      case "bottom-left":
        transformClasses =
          "-translate-x-[calc(100%+0.5rem)] translate-y-[0.5rem]";
        break;
      case "bottom-right":
        transformClasses = "translate-x-[0.5rem] translate-y-[0.5rem]";
        break;
    }

    return (
      <motion.div
        ref={ref}
        className={`absolute left-1/2 top-1/2 h-1/6 w-1/4 ${transformClasses} flex transform items-center justify-center rounded-xl border-2 bg-zinc-300`}
        onClick={onClick}
      >
        <p>{title}</p>
      </motion.div>
    );
  },
);

export default Card;
