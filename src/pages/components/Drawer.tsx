import React, { useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

interface DrawerProps {
  children: React.ReactNode;
  windowHeight: number;
}

const Drawer: React.FC<DrawerProps> = ({ children, windowHeight }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDrawerFullyOpen, setIsDrawerFullyOpen] = useState(false);

  const { scrollY: windowScrollY } = useScroll();
  const { scrollY: contentScrollY } = useScroll({ container: contentRef });

  const PEEK_HEIGHT = useMemo(() => windowHeight * 0.02, [windowHeight]);

  // Motion values
  const yRange = useTransform(
    windowScrollY,
    [0, windowHeight],
    [windowHeight - PEEK_HEIGHT, 0],
  );
  const y = useSpring(yRange, { stiffness: 300, damping: 30 });

  const borderRadius = useTransform(windowScrollY, [0, windowHeight], [24, 0]);

  const opacity = useTransform(y, [windowHeight, 0], [0, 1]);

  // Event handlers
  useMotionValueEvent(yRange, "change", (latest) => {
    console.log("yRange", latest);
    setIsDrawerFullyOpen(latest === 0);
    if (latest === 0) {
      console.log("Drawer is fully open");
    }
  });

  useMotionValueEvent(contentScrollY, "change", (latest) => {
    if (!isDrawerFullyOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  });

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-20 bg-white shadow-lg"
      style={{ borderRadius, height: windowHeight, y }}
    >
      <motion.div
        ref={contentRef}
        className={`h-full pt-2 ${isDrawerFullyOpen ? "overflow-y-auto" : "overflow-hidden"}`}
        style={{ opacity }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Drawer;
