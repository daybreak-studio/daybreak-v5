import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { CSSProperties, MouseEvent, ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

export const HoverCard = ({ children, className, style }: HoverCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 100,
    damping: 30,
  });

  const springY = useSpring(mouseY, {
    stiffness: 100,
    damping: 30,
  });

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      className={`frame-outer group relative flex h-full w-full overflow-hidden border border-orange-300/10 shadow-lg shadow-orange-300/5 transition-colors duration-500 ease-in-out hover:border-orange-300/20 hover:shadow-sm hover:shadow-orange-300/5 ${className}`}
      initial={{ scale: 1 }}
      whileHover={{ scale: 0.99 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      style={{
        ...style,
        WebkitTransform: "translate3d(0,0,0)",
        WebkitBackfaceVisibility: "hidden",
        transformOrigin: "center center",
      }}
      onMouseMove={handleMouseMove}
    >
      {children}

      {/* Single optimized glow effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-15"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              1000px circle at ${springX}px ${springY}px,
              rgba(255, 69, 0, 0.4),
              rgba(255, 166, 0, 0.3) 25%,
              rgba(255, 218, 185, 0.2) 25%,
              rgba(255, 255, 255, 0)
            )
          `,
          filter: "blur(30px)",
          WebkitTransform: "translate3d(0,0,0)",
        }}
      />
    </motion.div>
  );
};
