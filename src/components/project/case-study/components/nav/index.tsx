import { motion, AnimatePresence } from "framer-motion";
import IconChevronDown from "/public/icons/icon-chevron-down.svg";
import IconChevronUp from "/public/icons/icon-chevron-up.svg";
import IconCross from "/public/icons/icon-cross.svg";
import { AnimationConfig } from "@/components/animations/AnimationConfig";
import { useRef } from "react";

interface NavProps {
  activeGroup: number;
  groups: Array<{
    heading?: string;
    caption?: string;
  }>;
  isInfoVisible: boolean;
  onShowInfo: () => void;
  onHideInfo: () => void;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export default function CaseStudyNav({
  activeGroup,
  groups,
  isInfoVisible,
  onShowInfo,
  onHideInfo,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
}: NavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentGroup = groups[activeGroup];
  const hasCaption = !!(currentGroup?.heading && currentGroup?.caption);

  // Common styles for transform origin
  const originStyles = { transformOrigin: "bottom center" };

  // Common transition settings
  const commonTransition = {
    duration: 0.4,
    ease: AnimationConfig.EASE_OUT,
  };

  return (
    <AnimatePresence mode="wait">
      {hasCaption && (
        <motion.div
          ref={containerRef}
          className="fixed bottom-4 left-0 right-0 z-50 px-4"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={commonTransition}
          style={originStyles}
        >
          <motion.div
            layoutId="nav-container"
            className="mx-auto h-min w-min overflow-hidden bg-white bg-opacity-60 text-black drop-shadow-2xl backdrop-blur-2xl"
            animate={{
              borderRadius: isInfoVisible ? 32 : 16,
              padding: "6px",
            }}
            transition={commonTransition}
            style={originStyles}
          >
            <motion.div
              className="relative bg-white"
              animate={{
                borderRadius: isInfoVisible ? 28 : 12,
              }}
              transition={commonTransition}
              style={originStyles}
            >
              <AnimatePresence mode="wait">
                {!isInfoVisible ? (
                  <motion.button
                    className="flex w-full items-center justify-between gap-2 px-4 py-2 focus:outline-none"
                    onClick={onShowInfo}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    style={originStyles}
                  >
                    <span className="opacity-50">{currentGroup.heading}</span>
                    <motion.div
                      animate={{ rotate: 45 }}
                      transition={commonTransition}
                      style={originStyles}
                    >
                      <IconCross className="h-4 w-4 opacity-60" />
                    </motion.div>
                  </motion.button>
                ) : (
                  <motion.div
                    className="relative w-screen max-w-[400px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={commonTransition}
                    style={originStyles}
                  >
                    <div className="flex w-full flex-col gap-2 px-6 py-5">
                      {currentGroup.heading && (
                        <div className="flex w-full items-center justify-between text-xl">
                          <h4 className="opacity-70">{currentGroup.heading}</h4>
                        </div>
                      )}
                      {currentGroup.caption && (
                        <p className="mb-2 text-sm opacity-50">
                          {currentGroup.caption}
                        </p>
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={onPrev}
                          disabled={!canGoPrev}
                          className="rounded-full bg-white/80 p-2 transition-opacity hover:bg-white/90 disabled:opacity-30"
                        >
                          <IconChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={onNext}
                          disabled={!canGoNext}
                          className="rounded-full bg-white/80 p-2 transition-opacity hover:bg-white/90 disabled:opacity-30"
                        >
                          <IconChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={onHideInfo}
                      className={`absolute right-6 ${
                        currentGroup.heading ? "top-[1.45rem]" : "top-[2rem]"
                      }`}
                    >
                      <motion.div
                        animate={{ rotate: 0 }}
                        transition={commonTransition}
                        style={originStyles}
                      >
                        <IconCross className="h-4 w-4 opacity-60" />
                      </motion.div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
