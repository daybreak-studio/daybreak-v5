import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface DrawerProps {
  children: React.ReactNode;
  windowHeight: number;
}

const Drawer: React.FC<DrawerProps> = React.memo(
  ({ children, windowHeight }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Main page scroll
    const { scrollY } = useScroll();
    const yRange = useTransform(scrollY, [0, windowHeight], [windowHeight, 0]);
    const y = useSpring(yRange, { stiffness: 400, damping: 40 });

    // Inner content scroll
    const { scrollYProgress: contentScrollProgress } = useScroll({
      container: contentRef,
    });

    useEffect(() => {
      const unsubscribeY = y.on("change", (latest) => {
        setIsDrawerOpen(latest === 0);
      });

      return () => unsubscribeY();
    }, [y]);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      const contentElement = contentRef.current;
      if (!contentElement) return;

      if (!isDrawerOpen) {
        // If drawer is not fully open, let the page scroll handle it
        return;
      }

      const { scrollTop } = contentElement;
      const isContentAtTop = scrollTop === 0;

      if (isContentAtTop && e.deltaY < 0) {
        // If content is at top and scrolling up, start closing the drawer
        scrollY.set(scrollY.get() - e.deltaY);
        e.preventDefault();
      } else {
        // Otherwise, scroll the content
        contentElement.scrollTop += e.deltaY;
      }
    };

    return (
      <motion.div
        ref={containerRef}
        className={`fixed inset-x-0 bottom-0 z-20 overflow-hidden bg-white ${
          isDrawerOpen ? "rounded-t-none" : "rounded-t-[24px]"
        }`}
        style={{ height: windowHeight, y }}
      >
        <motion.div
          ref={contentRef}
          className={`h-full ${isDrawerOpen ? "overflow-y-auto" : "overflow-hidden"}`}
          animate={{ opacity: isDrawerOpen ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
          onWheel={handleWheel}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  },
);

Drawer.displayName = "Drawer";

export default Drawer;
