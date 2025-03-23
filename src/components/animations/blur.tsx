"use client";

import React from "react";
import { motion } from "framer-motion";
import { EASINGS } from "./easings";

const transition = { duration: 1.5, ease: EASINGS.easeOutQuart };
const variants = {
  hidden: { filter: "blur(20px)", transform: "translateY(20%)", opacity: 0 },
  visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function BlurReveal({
  children,
  className = "",
}: BlurRevealProps) {
  // If children is a string, split it into words
  const content = typeof children === "string" ? children.split(" ") : children;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ staggerChildren: 0.04 }}
      className={className}
    >
      {typeof content === "string" ? (
        <motion.span
          className="inline-block"
          transition={transition}
          variants={variants}
        >
          {content}
        </motion.span>
      ) : Array.isArray(content) ? (
        content.map((word, index) => (
          <React.Fragment key={index}>
            <motion.span
              className="inline-block"
              transition={transition}
              variants={variants}
            >
              {word}
            </motion.span>
            {index < content.length - 1 && " "}
          </React.Fragment>
        ))
      ) : (
        <motion.div transition={transition} variants={variants}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
