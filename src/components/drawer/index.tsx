import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

interface DrawerProps {
  children: React.ReactNode;
  windowHeight: number;
}

const DrawerButton = ({
  isOpen,
  isHovered,
  onClick,
}: {
  isOpen: boolean;
  isHovered: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="absolute flex w-full justify-center p-8">
      <motion.button
        onClick={onClick}
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm ${
          isOpen ? "sticky" : "absolute"
        }`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isOpen || isHovered ? 1 : 0,
          y: isHovered && !isOpen ? -2 : 0,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className="h-4 w-4 text-zinc-500" />
        </motion.div>
      </motion.button>
    </div>
  );
};

const Drawer: React.FC<DrawerProps> = ({ children, windowHeight }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const PEEK_HEIGHT = windowHeight * 0.05;
  const HOVER_PEEK_AMOUNT = 200;

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setIsHovered(false);
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
      className="fixed inset-x-0 bottom-0 z-50 bg-white/90 shadow-2xl backdrop-blur-2xl"
      style={{ height: windowHeight }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      onHoverStart={() => !isOpen && setIsHovered(true)}
      onHoverEnd={() => !isOpen && setIsHovered(false)}
      variants={{
        open: {
          y: 0,
          borderRadius: 0,
        },
        closed: {
          y: isHovered ? closedY - HOVER_PEEK_AMOUNT : closedY,
          borderRadius: 24,
        },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <AnimatePresence>
        <DrawerButton
          isOpen={isOpen}
          isHovered={isHovered}
          onClick={toggleDrawer}
        />
      </AnimatePresence>

      <motion.div
        ref={contentRef}
        className="pb-safe-bottom h-full overflow-y-auto overscroll-contain"
        animate={{
          opacity: isOpen ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          {/* Top lip activation zone for opening / closing drawer. Clicking this will act as a toggle, but we want it larger than the hitbox of the chevron. */}
          <motion.div
            className="absolute top-0 z-20 flex w-full cursor-pointer justify-center p-36"
            onClick={toggleDrawer}
            animate={isHovered && !isOpen ? { y: -4 } : { y: 0 }}
            transition={{ duration: 0.2 }}
          />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Drawer;
