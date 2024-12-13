import { motion, useTransform } from "framer-motion";
import React, { useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import { useItemTransition } from "./ItemTransition";

type Props = {
  children: React.ReactNode;
  index: number;
  className?: string;
};

const Stack = ({ children, index, className }: Props) => {
  const transitionProgress = useItemTransition({ index, activeRange: 0.03 });

  const { height: screenHeight } = useWindowSize();
  const opacity = useTransform(transitionProgress, [-1, 0], [0.2, 1]);
  const y = useTransform(
    transitionProgress,
    [-1, 0, 1],
    [30, 0, -screenHeight * 0.8],
    {
      clamp: false,
    },
  );
  const yWithToggleState = useTransform(
    [transitionProgress, y],
    ([transitionProgress, y]: number[]) => {
      // if (transitionProgress > 0.75) {
      //   return y - screenHeight * 0.12;
      // }
      return y;
    },
  );

  const scale = useTransform(transitionProgress, [-1, 0, 1], [0.95, 1, 1], {
    clamp: false,
  });
  const scaleWithToggleState = useTransform(
    [transitionProgress, scale],
    ([transitionProgress, scale]: number[]) => {
      if (transitionProgress >= 0) {
        return scale;
      }
      return scale - 0.06;
    },
  );

  const rotationDeviation = useMemo(
    () => (Math.random() + 0.5) * (Math.random() >= 0.5 ? -1 : 1),
    [],
  );
  const initialRotation = useMemo(() => Math.random() * 10 - 10 / 2, []);
  const rotate = useTransform(
    transitionProgress,
    [-1, 0],
    [initialRotation, 0],
  );
  const rotateWithToggleState = useTransform(
    [transitionProgress, rotate],
    ([transitionProgress, rotate]: number[]) => {
      if (transitionProgress >= 0) {
        return 0;
      }
      return initialRotation;
    },
  );
  const dropShadow = useTransform(
    transitionProgress,
    [-1, 0, 1],
    [
      "0px 0px 0px rgba(0, 0, 0, 0)",
      "0px 40px 60px rgba(0, 0, 0, 0.07)",
      "0px 40px 60px rgba(0, 0, 0, 0.07)",
    ],
    {
      clamp: false,
    },
  );

  return (
    <div
      style={{ zIndex: 100 - index }}
      // className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform px-8"
      className="relative h-0 w-full translate-y-[10vh] transform px-8"
    >
      <motion.div
        className={`mx-auto w-fit rounded-[32px] border bg-white`}
        style={{
          y: yWithToggleState,
          scale: scaleWithToggleState,
          rotate: rotateWithToggleState,
          boxShadow: dropShadow,
          transition: "transform .25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <motion.div style={{ opacity }} className={`${className}`}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Stack;
