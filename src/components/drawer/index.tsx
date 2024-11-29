import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

interface DrawerProps {
  children: React.ReactNode;
  windowHeight: number;
}

const Drawer: React.FC<DrawerProps> = ({ children, windowHeight }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const PEEK_HEIGHT = windowHeight * 0.08;

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const closedY = windowHeight - PEEK_HEIGHT;

  return (
    <motion.div
      id="drawer"
      className="fixed inset-x-0 bottom-0 z-50 bg-white/95 shadow-lg backdrop-blur-sm"
      style={{ height: windowHeight }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: {
          y: 0,
          borderRadius: 0,
        },
        closed: {
          y: closedY,
          borderRadius: 24,
        },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 flex cursor-pointer items-center justify-center p-2"
        onClick={toggleDrawer}
      >
        <motion.div
          className="rounded-full bg-gray-100 p-1.5 hover:bg-gray-200 active:bg-gray-300"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        ref={contentRef}
        className="pb-safe-bottom h-full overflow-y-auto overscroll-contain"
        style={{
          paddingTop: "3rem",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        animate={{
          opacity: isOpen ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Drawer;
