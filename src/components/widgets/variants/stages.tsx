import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BaseWidget } from "../grid/base-widget";
import { StagesWidgetTypes } from "../grid/types";
import { EASINGS } from "@/components/animations/easings";
import { useViewport } from "@/lib/hooks/use-viewport";
import { clsx } from "clsx";

// Tier configuration
const TIER_CONFIG = {
  padding: {
    mobile: ["p-4", "p-5", "p-6", "p-7"],
    desktop: ["md:p-6", "md:p-7", "md:p-8", "md:p-10"],
  },
  titleText: {
    mobile: ["text-base", "text-lg", "text-xl", "text-2xl"],
    desktop: ["md:text-xl", "md:text-2xl", "md:text-3xl", "md:text-4xl"],
  },
  descriptionText: {
    mobile: ["text-sm", "text-base", "text-lg", "text-xl"],
    desktop: ["md:text-xl", "md:text-2xl", "md:text-3xl", "md:text-4xl"],
  },
  blur: {
    factor: 0.5,
    description: {
      initial: 8,
      exit: 8,
    },
  },
  opacity: {
    inactive: 1,
    text: {
      base: 0.9,
      reduction: 0.25,
    },
  },
  background: {
    active: "bg-white/60",
    inactive: ["bg-white/40", "bg-white/30", "bg-white/20", "bg-white/10"],
  },
};

const getTierStyles = (tierLevel: number, isActive: boolean) => {
  const padding = `${TIER_CONFIG.padding.mobile[tierLevel]} ${TIER_CONFIG.padding.desktop[tierLevel]}`;
  const titleSize = `${TIER_CONFIG.titleText.mobile[tierLevel]} ${TIER_CONFIG.titleText.desktop[tierLevel]}`;
  const descriptionSize = `${TIER_CONFIG.descriptionText.mobile[tierLevel]} ${TIER_CONFIG.descriptionText.desktop[tierLevel]}`;
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

// Update the ANIMATION_CONFIG with text-specific timings
const ANIMATION_CONFIG = {
  duration: {
    opacity: 1,
    blur: 1,
    layout: 2,
    text: {
      opacity: 1.8,
      blur: 1.8,
      delay: 0.25,
    },
  },
  ease: {
    opacity: EASINGS.easeOutQuart,
    blur: EASINGS.easeOutQuart,
    layout: EASINGS.easeOutQuart,
    text: {
      opacity: EASINGS.easeOutExpo,
      blur: EASINGS.easeOutExpo,
    },
  },
};

export default function StagesWidget({ data }: StagesProps) {
  const stages = [...(data.stages ?? [])].reverse();
  const [index, setIndex] = useState(stages.length - 1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStageInteraction = (stageIndex: number) => {
    setIndex(stageIndex);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const relativeY = clientY - containerRect.top;
    const containerHeight = containerRect.height;

    const stageHeight = containerHeight / stages.length;
    const activeStageIndex = Math.min(
      Math.floor(relativeY / stageHeight),
      stages.length - 1,
    );

    if (activeStageIndex >= 0 && activeStageIndex < stages.length) {
      handleStageInteraction(activeStageIndex);
    }
  };

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
        return (
          <div
            ref={containerRef}
            className="relative h-full w-full touch-none"
            onTouchMove={(e: React.TouchEvent) => handleTouchMove(e)}
            onTouchStart={(e: React.TouchEvent) => handleTouchMove(e)}
          >
            {/* Single morphing background that follows active state */}
            <motion.div
              layoutId="morphing-background"
              className={clsx(
                "pointer-events-none absolute inset-0 rounded-2xl md:rounded-3xl",
                TIER_CONFIG.background.active,
              )}
              animate={{
                top: `${index * 15}%`,
                right: `${index * 15}%`,
              }}
              transition={{
                duration: 1.1,
                ease: EASINGS.easeOutQuart,
              }}
            />

            <AnimatePresence mode="wait">
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
                      !isActive && styles.background, // Only apply background if not active
                      "cursor-pointer touch-none",
                    )}
                    style={{
                      top: offset,
                      right: offset,
                      bottom: "0px",
                      left: "0px",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity:
                        stageIndex > index
                          ? 0
                          : stageIndex === index
                            ? 1
                            : TIER_CONFIG.opacity.inactive,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: {
                        duration: ANIMATION_CONFIG.duration.opacity,
                        ease: ANIMATION_CONFIG.ease.opacity,
                      },
                      layout: {
                        duration: ANIMATION_CONFIG.duration.layout,
                        ease: ANIMATION_CONFIG.ease.layout,
                      },
                    }}
                    layout
                    layoutId={`stage-container-${stageIndex}`}
                    onHoverStart={() => handleStageInteraction(stageIndex)}
                    onClick={() => handleStageInteraction(stageIndex)}
                  >
                    <motion.div
                      className="flex h-full flex-col justify-between"
                      layoutId={`stage-content-${stageIndex}`}
                    >
                      <motion.h1
                        layoutId={`stage-title-${stageIndex}`}
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
                          duration: ANIMATION_CONFIG.duration.text.blur,
                          ease: ANIMATION_CONFIG.ease.text.blur,
                          delay: ANIMATION_CONFIG.duration.text.delay,
                          opacity: {
                            duration: ANIMATION_CONFIG.duration.text.opacity,
                            ease: ANIMATION_CONFIG.ease.text.opacity,
                            delay: ANIMATION_CONFIG.duration.text.delay,
                          },
                        }}
                      >
                        {stage.title}
                      </motion.h1>
                      <motion.p
                        layoutId={`stage-description-${stageIndex}`}
                        className={clsx(
                          "text-neutral-400",
                          styles.descriptionSize,
                        )}
                        initial={{ filter: "blur(8px)", opacity: 0 }}
                        animate={{
                          filter: isActive ? "blur(0px)" : "blur(8px)",
                          opacity: isActive ? 1 : 0,
                        }}
                        transition={{
                          duration: ANIMATION_CONFIG.duration.text.blur,
                          ease: ANIMATION_CONFIG.ease.text.blur,
                          delay: ANIMATION_CONFIG.duration.text.delay,
                          opacity: {
                            duration: ANIMATION_CONFIG.duration.text.opacity,
                            ease: ANIMATION_CONFIG.ease.text.opacity,
                            delay: ANIMATION_CONFIG.duration.text.delay,
                          },
                        }}
                      >
                        {stage.description}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        );
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
