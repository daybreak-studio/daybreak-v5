import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface DrawerProps {
  children: React.ReactNode;
  scrollY: MotionValue<number>;
  windowHeight: number;
}

const Drawer: React.FC<DrawerProps> = ({ children, scrollY, windowHeight }) => {
  const drawerY = useTransform(
    scrollY,
    [0, windowHeight],
    [windowHeight - windowHeight * 0.03, 0],
  );
  const cornerRadius = useTransform(scrollY, [0, windowHeight], [24, 0]);

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-20 overflow-hidden bg-white"
      style={{
        y: drawerY,
        height: windowHeight,
        borderTopLeftRadius: cornerRadius,
        borderTopRightRadius: cornerRadius,
      }}
    >
      <div className="hide-scrollbar h-full overflow-y-auto">{children}</div>
    </motion.div>
  );
};

export default Drawer;
