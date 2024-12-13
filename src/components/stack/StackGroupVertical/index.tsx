import { useScroll } from "framer-motion";
import React, { Children, RefObject, useRef } from "react";
import ItemTransitionGroup from "../Stack/ItemTransition";

type Props = {
  children: React.ReactNode;
};

const StackGroupVetical = ({ children }: Props) => {
  const containerRef = useRef() as RefObject<HTMLDivElement>;
  const itemsCount = Children.count(children);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  // useMotionValueEvent(scrollYProgress, "change", (latest) =>
  //   console.log(latest),
  // );

  return (
    <>
      <ItemTransitionGroup progress={scrollYProgress} itemsCount={itemsCount}>
        <div
          ref={containerRef}
          style={{
            height: `${(itemsCount + 1) * 100}vh`,
          }}
        >
          <div className="sticky left-0 right-0 top-0 block h-screen w-full">
            {children}
          </div>
        </div>
      </ItemTransitionGroup>
      {/* padding at the end */}
      <div className="h-[50vh] bg-gray-300"></div>
    </>
  );
};

export default StackGroupVetical;
