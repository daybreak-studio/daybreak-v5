import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ScrollDrawerProps {
  children: ReactNode;
  className?: string;
}

const ScrollDrawer: React.FC<ScrollDrawerProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "relative mt-[90vh] rounded-t-[24px] bg-white/90 shadow backdrop-blur-2xl",
        "overscroll-behavior-none z-[100]",
        className,
      )}
      style={{
        overscrollBehavior: "none",
      }}
    >
      <motion.div
        className="relative h-full w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollDrawer;
