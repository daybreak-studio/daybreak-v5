import { MotionProps } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";

// Only keep the shared animations
export const CONTAINER_ANIMATION: MotionProps = {
  initial: false,
  layout: true,
  transition: {
    layout: {
      duration: 0.8,
      ease: EASINGS.easeOutQuart,
    },
  },
};

export const IMAGE_ANIMATION: MotionProps = {
  initial: false,
  layout: true,
  transition: {
    layout: {
      duration: 0.8,
      ease: EASINGS.easeOutQuart,
    },
  },
};
