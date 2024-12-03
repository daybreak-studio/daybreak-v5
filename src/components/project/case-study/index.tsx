import { motion, animate } from "framer-motion";
import { CaseStudy, Work } from "@/sanity/types";
import { useCallback, useEffect, useState, useRef, Fragment } from "react";
import CaseStudyNav from "./components/nav";
import MediaGroup from "./components/media-group";
import { AnimationConfig } from "@/components/animations/AnimationConfig";
import { AnimatePresence } from "framer-motion";

interface ProjectCaseStudyProps {
  data: Work;
  imageLayoutId: string; // Used for shared element transitions
}

export default function ProjectCaseStudy({
  data,
  imageLayoutId,
}: ProjectCaseStudyProps) {
  // Get the first project which should be a case study
  const project = data.projects?.[0] as CaseStudy & { _key: string };

  // Track the currently visible/active media group
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  // Track whether we're in zoomed/focused mode
  const [isZoomed, setIsZoomed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{ stop: () => void }>();

  // Smoothly scroll to a media group by its index
  const scrollToGroup = useCallback((index: number) => {
    const element = document.getElementById(`media-group-${index}`);
    if (!element || !containerRef.current) return;

    // Cancel any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    const container = containerRef.current;
    const elementTop = element.offsetTop;
    const containerHeight = container.clientHeight;
    const elementHeight = element.clientHeight;
    const targetScroll = elementTop - (containerHeight - elementHeight) / 2;

    // Store the animation control in the ref
    animationRef.current = animate(container.scrollTop, targetScroll, {
      type: "spring",
      stiffness: 100,
      damping: 20,
      onUpdate: (value) => container.scrollTo(0, value),
      onComplete: () => {
        animationRef.current = undefined;
      },
    });
  }, []);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  // Handle clicking on a media group
  const handleGroupActivate = useCallback(
    (index: number) => {
      setActiveGroupIndex(index);
      setIsZoomed(true);

      // Ensure DOM is ready before scrolling
      requestAnimationFrame(() => {
        scrollToGroup(index);
      });
    },
    [scrollToGroup],
  );

  // Handle when a media group comes into view during scrolling
  const handleGroupScroll = useCallback((index: number) => {
    setActiveGroupIndex(index);
  }, []);

  // Find the next or previous media group based on current conditions
  const findNextGroup = useCallback(
    (
      currentIndex: number,
      direction: 1 | -1,
      onlyWithCaption: boolean = false,
    ) => {
      if (!project.mediaGroups) return null;
      let index = currentIndex + direction;

      // Keep looking in the specified direction until we find a valid group
      while (index >= 0 && index < project.mediaGroups.length) {
        const group = project.mediaGroups[index];

        // In normal mode, accept any group
        if (!onlyWithCaption) {
          return index;
        }

        // In zoom mode, only accept groups with both heading and caption
        if (group.heading && group.caption) {
          return index;
        }

        // Keep looking in the specified direction
        index += direction;
      }

      return null; // No valid group found
    },
    [project.mediaGroups],
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events when case study is open
      if (!document.querySelector('[role="dialog"]')) return;

      switch (e.code) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          setIsZoomed(false);
          break;
        case "Enter":
        case "Space":
        case "Tab":
          e.preventDefault();
          e.stopPropagation();
          setIsZoomed(!isZoomed);
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          // In zoomed mode, only navigate between groups with captions
          const prevIndex = findNextGroup(activeGroupIndex, -1, isZoomed);
          if (prevIndex !== null) scrollToGroup(prevIndex);
          break;
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          // In zoomed mode, only navigate between groups with captions
          const nextIndex = findNextGroup(activeGroupIndex, 1, isZoomed);
          if (nextIndex !== null) scrollToGroup(nextIndex);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isZoomed, activeGroupIndex, findNextGroup, scrollToGroup]);

  return (
    <motion.div
      ref={containerRef}
      className="hide-scrollbar h-screen overflow-y-auto px-4 py-8 pt-24 xl:px-8 xl:pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: AnimationConfig.EASE_OUT }}
    >
      {/* Project Title */}
      <motion.h1
        className="mb-8 py-24 text-center text-4xl xl:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: AnimationConfig.EASE_OUT }}
      >
        {project.heading}
      </motion.h1>

      <div className="flex flex-col gap-4 xl:gap-8">
        {/* Media Groups */}
        {project.mediaGroups?.map((group, index) => (
          <MediaGroup
            key={index}
            id={`media-group-${index}`}
            group={group}
            index={index}
            isActive={activeGroupIndex === index}
            isZoomed={isZoomed}
            onScroll={handleGroupScroll}
            onActivate={() => handleGroupActivate(index)}
            layoutId={index === 0 ? imageLayoutId : undefined}
          />
        ))}

        {/* Credits Section */}
        {project.credits && (
          <motion.div
            className="mx-auto my-72 grid w-full grid-cols-2 gap-y-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {project.credits.map((credit, index) => (
              <Fragment key={index}>
                <div className="flex flex-row">
                  {credit.role}
                  <div className="mx-4 h-0 flex-grow translate-y-2 border-b border-gray-200" />
                </div>
                <div className="opacity-50">
                  {credit.names?.map((name, index) => (
                    <div key={index}>{name}</div>
                  ))}
                </div>
              </Fragment>
            ))}
          </motion.div>
        )}
      </div>

      {/* Navigation UI - Only shows for groups with headings */}
      <AnimatePresence mode="popLayout">
        {project.mediaGroups?.[activeGroupIndex]?.heading && (
          <CaseStudyNav
            activeGroup={activeGroupIndex}
            groups={project.mediaGroups ?? []}
            isExpanded={isZoomed}
            onToggleExpand={() => setIsZoomed(!isZoomed)}
            onNext={() => {
              const nextIndex = findNextGroup(activeGroupIndex, 1, isZoomed);
              if (nextIndex !== null) scrollToGroup(nextIndex);
            }}
            onPrev={() => {
              const nextIndex = findNextGroup(activeGroupIndex, -1, isZoomed);
              if (nextIndex !== null) scrollToGroup(nextIndex);
            }}
            canGoNext={findNextGroup(activeGroupIndex, 1, isZoomed) !== null}
            canGoPrev={findNextGroup(activeGroupIndex, -1, isZoomed) !== null}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
