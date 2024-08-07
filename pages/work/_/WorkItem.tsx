import { motion, useTransform } from "framer-motion";
import { useInfiniteScroll } from "./InfiniteScrollArea";
import {
  useItemTransitionProgress,
  useOffsetProgress,
} from "./useItemTransitionProgress";
import { useWindowSize } from "usehooks-ts";
import { useMotionValueSwitch } from "../../../hooks/useMotionValueSwitch";

type WorkItemProps = {
  name: string;
  index: number;
};
const WorkItem = ({ name, index }: WorkItemProps) => {
  const { scroll } = useInfiniteScroll();
  const itemHeight = 200;

  const windowSize = useWindowSize();
  const progress = useOffsetProgress({
    value: scroll,
    position: itemHeight * index - windowSize.height / 2,
    transitionRange: windowSize.height * 0.67,
  });

  const activeMargin = 0.7;
  const isActive = useMotionValueSwitch(
    progress,
    (latest) => latest > -1 + activeMargin && latest < 1 - activeMargin,
  );

  const scale = useTransform(progress, [-1, 0, 1], [0, 1, 0.0]);
  const y = useTransform(
    progress,
    [-1, 0, 1],
    [-itemHeight * 0.4, 0, itemHeight * 0.4],
  );

  return (
    <motion.div
      style={{
        scale,
        y,
      }}
      className="rounded-xl bg-zinc-300 h-[150px] mx-24 my-2 p-4"
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: isActive ? 1 : 0,
        }}
      >
        {name}
      </motion.div>
    </motion.div>
  );
};

export default WorkItem;
