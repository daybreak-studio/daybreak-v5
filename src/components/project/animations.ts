import { MotionProps } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";

// Only keep the shared animations
export const CONTAINER_ANIMATION: MotionProps = {
  layout: true,
  transition: {
    layout: {
      duration: 1,
      ease: EASINGS.easeOutQuart,
    },
  },
};

export const IMAGE_ANIMATION: MotionProps = {
  layout: true,
  transition: {
    layout: {
      duration: 1,
      ease: EASINGS.easeOutQuart,
    },
  },
};
