import { motion } from "framer-motion";

// import icons
import IconChevronDown from "/public/icons/icon-chevron-down.svg";
import IconChevronUp from "/public/icons/icon-chevron-up.svg";
import IconCross from "/public/icons/icon-cross.svg";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import IconButton from "@/components/buttons/icon-button";
import { useOnClickOutside } from "usehooks-ts";
import MorphingSheet from "@/components/morphing-sheet";
import { AnimationConfig } from "@/components/animations/AnimationConfig";

type HighlightInfo = {
  heading?: string;
  caption?: string;
};

type Props = {
  onExpand: () => void;
  onCollapse: () => void;
  highlightInfoArr?: HighlightInfo[];
  onNextMediaGroup: () => void;
  onPrevMediaGroup: () => void;
  canNextMediaGroup: boolean;
  canPrevMediaGroup: boolean;
  currentInfoIndex: number;
  isExpanded: boolean;
};

const CaseStudyNav = ({
  highlightInfoArr,
  onNextMediaGroup,
  onPrevMediaGroup,
  canNextMediaGroup,
  canPrevMediaGroup,
  currentInfoIndex,
  onExpand,
  onCollapse,
  isExpanded,
}: Props) => {
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const currentInfo =
    currentInfoIndex === undefined
      ? undefined
      : highlightInfoArr && highlightInfoArr[currentInfoIndex];

  useOnClickOutside(
    containerRef,
    () => {
      onCollapse();
    },
    "mouseup",
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onCollapse();
      }

      if (e.code === "Enter" && isExpanded) {
        onCollapse();
      }

      if (e.code === "Enter" && !isExpanded) {
        onExpand();
      }

      if (e.code === "ArrowDown" || e.code === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        onNextMediaGroup();
      }
      if (e.code === "ArrowUp" || (e.code === "Tab" && e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        onPrevMediaGroup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCollapse, onNextMediaGroup, onPrevMediaGroup, isExpanded, onExpand]);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <MorphingSheet
        ref={containerRef}
        rounded={isExpanded ? 32 : 16}
        withBorder={currentInfo?.heading ? isExpanded : false}
      >
        {!isExpanded && currentInfo?.heading && (
          <>
            <motion.button
              key={"collapsed"}
              initial={{ opacity: 0 }}
              animate={{
                transition: {
                  duration: 0.4,
                },
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2"
              // onClick={() => setIsExpanded(true)}
              onClick={() => onExpand()}
            >
              <div className="opacity-50">{currentInfo?.heading}</div>
              <motion.div
                layout
                layoutId={`${currentInfoIndex}-expand-toggle`}
                style={{
                  rotate: 45,
                }}
                className="bg-white"
                transition={{
                  ease: AnimationConfig.EASE_OUT,
                  duration: 0.4,
                }}
              >
                <IconCross />
              </motion.div>
            </motion.button>
          </>
        )}

        {isExpanded && currentInfo && currentInfo.heading && (
          <div className="relative">
            {highlightInfoArr?.map((info, index) => (
              <motion.div
                key={`expanded-${index}`}
                className="flex w-screen max-w-[400px] flex-col gap-2 px-6 py-5"
                initial={{
                  opacity: 0,
                }}
                style={{
                  position:
                    index === currentInfoIndex ? "relative" : "absolute",
                }}
                animate={{
                  opacity:
                    index > currentInfoIndex
                      ? 0
                      : index < currentInfoIndex
                        ? 0
                        : 1,
                  y:
                    index > currentInfoIndex
                      ? 10
                      : index < currentInfoIndex
                        ? -10
                        : 0,
                  transition: {
                    ease: AnimationConfig.EASE_OUT,
                    duration:
                      index !== currentInfoIndex ? 0 : AnimationConfig.SLOW,
                  },
                }}
                exit={{
                  opacity: 0,
                }}
              >
                {info.heading && (
                  <div className="flex w-full items-center justify-between text-xl opacity-70">
                    <h4>{info.heading}</h4>
                  </div>
                )}
                {info.caption && (
                  <p className="mb-2 text-sm opacity-50">{info.caption}</p>
                )}
                <div className="flex gap-1">
                  <IconButton
                    disabled={!canPrevMediaGroup}
                    icon={IconChevronUp}
                    onClick={onPrevMediaGroup}
                  />
                  <IconButton
                    disabled={!canNextMediaGroup}
                    icon={IconChevronDown}
                    onClick={onNextMediaGroup}
                  />
                </div>
              </motion.div>
            ))}
            <button
              // onClick={() => setIsExpanded(false)}
              onClick={() => onCollapse()}
              className={`absolute right-6 ${currentInfo.heading ? "top-[1.45rem]" : "top-[2rem]"}`}
            >
              <motion.div
                layout
                layoutId={`${currentInfoIndex}-expand-toggle`}
                style={{
                  rotate: 0,
                }}
                transition={{
                  ease: [0.33, 1, 0.68, 1],
                  duration: 0.4,
                }}
              >
                <IconCross />
              </motion.div>
            </button>
          </div>
        )}
      </MorphingSheet>
    </div>
  );
};
export default CaseStudyNav;
