import React, { MutableRefObject, useContext, useRef, useTransition } from "react";
import WorkItem from "./WorkItem";
import { motion, MotionValue, useDomEvent, useMotionValue, useTransform } from "framer-motion";
import { useEventListener } from "usehooks-ts";

type Props = {
  children: React.ReactNode;
}

const InfiniteScrollContext = React.createContext({
  scroll: new MotionValue()
})
export const useInfiniteScroll = () => useContext(InfiniteScrollContext);

const InfiniteScrollArea = ({ children }: Props) => {
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const scrollOffset = useMotionValue(0);
  const y = useTransform(scrollOffset, (latest) => -latest);

  useEventListener("wheel", (e: WheelEvent) => {
    const delta = e.deltaY;
    const current = scrollOffset.get();
    // wheel
    scrollOffset.set(current + delta);
  });

  return (
    <div className="fixed inset-0 h-screen overflow-y-hidden" ref={containerRef}>
      <motion.div style={{
        y
      }}>
        <InfiniteScrollContext.Provider value={{ scroll: scrollOffset }} >
          {children}
        </InfiniteScrollContext.Provider>
      </motion.div>
    </div>
  )
}

export default InfiniteScrollArea
