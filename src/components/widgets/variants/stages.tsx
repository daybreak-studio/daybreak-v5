import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BaseWidget } from "../grid/base-widget";
import { StagesWidgetTypes } from "../grid/types";
import { EASINGS } from "@/components/animations/easings";
import { useViewport } from "@/lib/hooks/use-viewport";
import { clsx } from "clsx";

interface StagesProps {
  data: StagesWidgetTypes;
}

interface Stage {
  _key: string;
  title: string;
  description: string;
}

export default function StagesWidget({ data }: StagesProps) {
  // Reverse stages once at initialization
  const stages = [...(data.stages ?? [])].reverse();
  const [index, setIndex] = useState(stages.length - 1);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const { isMobile } = useViewport();

  const handleNext = () => {
    if (stages.length === 0) return;
    setDirection("up");
    setIndex((prev) => (prev + 1) % stages.length);
  };

  const handlePrev = () => {
    if (stages.length === 0) return;
    setDirection("down");
    setIndex((prev) => (prev - 1 < 0 ? stages.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction: "up" | "down") => ({
      y: direction === "up" ? 20 : -20,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: "up" | "down") => ({
      y: direction === "up" ? -20 : 20,
      opacity: 0,
    }),
  };

  const renderMobileContent = () => (
    <div
      onClick={handleNext}
      className="frame-inner flex h-full w-full flex-col justify-between bg-white/20 p-6"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.4,
            ease: EASINGS.easeInOutQuart,
          }}
          className="flex h-full flex-col justify-between"
        >
          <h1 className="font-medium text-neutral-500">
            {stages[index]?.title}
          </h1>
          <p className="text-sm text-neutral-400">
            {stages[index]?.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderDesktopContent = () => (
    <div className="relative h-full w-full">
      {stages.map((stage, stageIndex) => {
        const offset = stageIndex * 56;
        const isActive = stageIndex === index;
        return (
          <motion.div
            key={stage._key}
            className={clsx(
              "frame-inner absolute inset-0 origin-bottom-left border border-dashed border-neutral-200",
              isActive ? "bg-white/50" : "bg-white/10",
            )}
            style={{
              top: `${offset}px`,
              right: `${offset}px`,
              bottom: "0px",
              left: "0px",
            }}
            initial={false}
            animate={{
              opacity: stageIndex > index ? 0 : stageIndex === index ? 1 : 0.75,
            }}
            transition={{
              duration: 0.4,
              ease: EASINGS.easeOutQuart,
            }}
            onHoverStart={() => setIndex(stageIndex)}
            onHoverEnd={() => setIndex(stages.length - 1)}
          >
            <div className="flex h-full flex-col justify-between p-5">
              <h1 className="font-medium text-neutral-500">{stage.title}</h1>
              {isActive && (
                <p className="text-sm text-neutral-400">{stage.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    switch (data.size) {
      case "1x1":
      case "3x3":
        return (
          <div className="frame-inner flex h-full w-full flex-col p-6">
            <h1 className="text-xs text-neutral-500">
              Please use a supported widget size: 2x2
            </h1>
          </div>
        );
      case "2x2":
        return isMobile ? renderMobileContent() : renderDesktopContent();
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
