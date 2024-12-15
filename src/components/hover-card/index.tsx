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

  // Add spring physics to the mouse position
  const springX = useSpring(mouseX, {
    stiffness: 150,
    damping: 15,
  });

  const springY = useSpring(mouseY, {
    stiffness: 150,
    damping: 15,
  });

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      className={`group relative flex h-full w-full overflow-hidden rounded-xl border border-orange-300/10 shadow-lg shadow-orange-300/5 transition-all duration-500 ease-in-out hover:scale-[99%] hover:border-orange-300/20 hover:shadow-sm hover:shadow-orange-300/5 ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
    >
      {/* Border glow effect - similar to card::after */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-15"
        style={{
          background: useMotionTemplate`
              radial-gradient(
                1000px circle at ${springX}px ${springY}px,
                rgba(255, 69, 0, 0.4),
                rgba(255, 166, 0, 0.3) 25%,
                rgba(255, 218, 185, 0.2) 25%,
                transparent 100%
              )
            `,
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />

      {/* Inner glow effect - similar to card::before */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-15"
        style={{
          background: useMotionTemplate`
              radial-gradient(
                1400px circle at ${springX}px ${springY}px,
                rgba(255, 69, 0, 0.15),
                rgba(255, 166, 0, 0.1) 25%,
                rgba(255, 218, 185, 0.05) 50%,
                transparent 100%
              )
            `,
          filter: "blur(35px)",
          zIndex: 3,
        }}
      />
      {children}
    </motion.div>
  );
};
