import { MotionProps } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";

// Only keep the shared animations
export const CONTAINER_ANIMATION: MotionProps = {
  layout: true,
  initial: { filter: "blur(10px)" },
  animate: { filter: "blur(0px)" },
  exit: { filter: "blur(10px)" },
  transition: {
    layout: { duration: 0.6, ease: EASINGS.easeOutExpo },
    default: { duration: 0.6, ease: EASINGS.easeOutCubic },
  },
};

export const IMAGE_ANIMATION: MotionProps = {
  layout: true,
  initial: { filter: "blur(10px)" },
  animate: { filter: "blur(0px)" },
  exit: { filter: "blur(10px)" },
  transition: {
    layout: { duration: 0.6, ease: EASINGS.easeOutExpo },
    default: { duration: 0.6, ease: EASINGS.easeOutCubic },
  },
};
