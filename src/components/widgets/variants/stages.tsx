import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BaseWidget } from "../grid/base-widget";
import { StagesWidgetTypes } from "../grid/types";
import { EASINGS } from "@/components/animations/easings";
import { useViewport } from "@/lib/hooks/use-viewport";
import { clsx } from "clsx";

// Tier configuration
const TIER_CONFIG = {
  padding: {
    mobile: [4, 5, 6, 7], // p-4 to p-7
    desktop: [6, 7, 8, 10], // p-6 to p-10
  },
  titleText: {
    mobile: ["text-base", "text-lg", "text-xl", "text-2xl"],
    desktop: ["text-xl", "text-2xl", "text-3xl", "text-4xl"],
  },
  descriptionText: {
    mobile: ["text-sm", "text-base", "text-lg", "text-xl"],
    desktop: ["text-xl", "text-2xl", "text-3xl", "text-4xl"],
  },
  blur: {
    factor: 0.5, // blur multiplier per tier
    description: {
      initial: 8,
      exit: 8,
    },
  },
  opacity: {
    inactive: 1,
    text: {
      base: 0.9,
      reduction: 0.25, // per tier
    },
  },
  background: {
    active: "bg-white/60",
    inactive: [
      "bg-white/40", // front
      "bg-white/30",
      "bg-white/20",
      "bg-white/10", // back
    ],
  },
};

const getTierStyles = (tierLevel: number, isActive: boolean) => {
  const padding = `p-${TIER_CONFIG.padding.mobile[tierLevel]} lg:p-${TIER_CONFIG.padding.desktop[tierLevel]}`;
  const titleSize = `${TIER_CONFIG.titleText.mobile[tierLevel]} lg:${TIER_CONFIG.titleText.desktop[tierLevel]}`;
  const descriptionSize = `${TIER_CONFIG.descriptionText.mobile[tierLevel]} lg:${TIER_CONFIG.descriptionText.desktop[tierLevel]}`;
  const blurAmount = tierLevel * TIER_CONFIG.blur.factor;
  const textOpacity =
    TIER_CONFIG.opacity.text.base -
    tierLevel * TIER_CONFIG.opacity.text.reduction;
  const background = isActive
    ? TIER_CONFIG.background.active
    : TIER_CONFIG.background.inactive[tierLevel];

  return {
    padding,
    titleSize,
    descriptionSize,
    blur: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
    opacity: isActive ? 1 : textOpacity,
    background,
  };
};

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
          <h1 className="text-2xl font-medium text-neutral-500">
            {stages[index]?.title}
          </h1>
          <p className="text-lg text-neutral-400">
            {stages[index]?.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderDesktopContent = () => (
    <div className="relative h-full w-full">
      {stages.map((stage, stageIndex) => {
        const offset = stageIndex * 15 + "%";
        const isActive = stageIndex === index;
        const tierLevel = stages.length - 1 - stageIndex;
        const styles = getTierStyles(tierLevel, isActive);

        return (
          <motion.div
            key={stage._key}
            className={clsx(
              "frame-inner absolute inset-0 origin-bottom-left border-[1px] border-dashed border-neutral-300/75",
              styles.padding,
              isActive ? TIER_CONFIG.background.active : styles.background,
            )}
            style={{
              top: offset,
              right: offset,
              bottom: "0px",
              left: "0px",
            }}
            initial={false}
            animate={{
              opacity:
                stageIndex > index
                  ? 0
                  : stageIndex === index
                    ? 1
                    : TIER_CONFIG.opacity.inactive,
            }}
            transition={{
              duration: 0.4,
              ease: EASINGS.easeOutQuart,
            }}
            onHoverStart={() => setIndex(stageIndex)}
            onHoverEnd={() => setIndex(stages.length - 1)}
          >
            <div className="flex h-full flex-col justify-between">
              <motion.h1
                className={clsx(
                  "font-medium text-neutral-500",
                  styles.titleSize,
                )}
                initial={{ filter: "blur(8px)", opacity: 0 }}
                animate={{
                  filter: isActive ? "blur(0px)" : "blur(8px)",
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: EASINGS.easeOutExpo,
                }}
              >
                {stage.title}
              </motion.h1>
              <motion.p
                className={clsx("text-neutral-400", styles.descriptionSize)}
                initial={{ filter: "blur(8px)", opacity: 0 }}
                animate={{
                  filter: isActive ? "blur(0px)" : "blur(8px)",
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: EASINGS.easeOutExpo,
                }}
              >
                {stage.description}
              </motion.p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    switch (data.size) {
      case "1x1":
      case "2x2":
        return (
          <div className="frame-inner flex h-full w-full flex-col p-6">
            <h1 className="text-xs text-neutral-500">
              Please use a supported widget size: 3x3
            </h1>
          </div>
        );
      case "3x3":
        return renderDesktopContent();
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
