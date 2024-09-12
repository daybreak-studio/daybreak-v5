import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface DrawerProps {
  children: React.ReactNode;
  windowHeight: number;
}

const Drawer: React.FC<DrawerProps> = ({ children, windowHeight }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const { scrollY: contentScrollY } = useScroll({ container: contentRef });

  const yRange = useTransform(scrollY, [0, windowHeight], [windowHeight, 0]);
  const y = useSpring(yRange, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-20 bg-white shadow-lg"
      style={{ height: windowHeight, y }}
    >
      <motion.div ref={contentRef} className="h-full overflow-y-auto">
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Drawer;
