import { motion, animate, easeOut, useInView, PanInfo } from "framer-motion";
import { CaseStudy, Clients } from "@/sanity/types";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  Fragment,
  forwardRef,
  memo,
  useMemo,
} from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/sanity/lib/media";
import { EASINGS } from "@/components/animations/easings";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import { getMediaAssetId } from "@/sanity/lib/media";
import { IMAGE_ANIMATION } from "./animations";
import { useViewport } from "@/lib/hooks/use-viewport";
import { useMediaQuery } from "usehooks-ts";
import Lenis from "lenis";

// Types
interface ProjectCaseStudyProps {
  data: Clients;
}

interface MediaGroupProps {
  id: string;
  group: {
    heading?: string;
    caption?: string;
    media?: MediaItem[];
  };
  index: number;
  isActive: boolean;
  isZoomed: boolean;
  activeGroupIndex: number;
  onScroll: (index: number) => void;
  onActivate: () => void;
}

interface NavigationProps {
  activeGroup: number;
  groups: Array<{ heading?: string; caption?: string }>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

// Add stagger animation for media groups
const STAGGER_ANIMATION = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  },
} as const;

// Add fade up animation for media items
const FADE_UP_ANIMATION = {
  variants: {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: EASINGS.easeOutQuart,
      },
    },
  },
} as const;

// MediaGroup Component - Optimized with memo and simplified scroll handling
const MediaGroup = memo(function MediaGroup({
  id,
  group,
  index,
  isActive,
  isZoomed,
  onScroll,
  onActivate,
}: MediaGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isDesktop } = useViewport();
  const isInView = useInView(ref, {
    amount: "some",
    margin: "-45% 0px -45% 0px",
  });

  // Simple throttled scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isInView) {
      timeoutId = setTimeout(() => {
        onScroll(index);
      }, 100);
    }
    return () => clearTimeout(timeoutId);
  }, [isInView, index, onScroll]);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={false}
      animate={{
        scale: isZoomed ? (isActive ? 0.98 : 0.92) : 1,
      }}
      whileHover={{
        scale: isZoomed ? (isActive ? 0.98 : 0.92) : 0.99,
      }}
      transition={{
        duration: 1.2,
        ease: EASINGS.easeOutQuart,
      }}
      className={cn(
        "grid origin-center gap-4 md:cursor-pointer",
        group.media?.length === 1
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2",
      )}
      onClick={() => {
        if (isDesktop) {
          onActivate();
        }
      }}
    >
      {group.media?.map((media, mediaIndex) => {
        // First two groups load immediately with no animation
        const isInitialGroup = index < 2;

        return (
          <motion.div
            key={`${index}-${mediaIndex}`}
            initial={
              isInitialGroup
                ? { opacity: 1 }
                : { opacity: 0, y: 20, filter: "blur(8px)" }
            }
            animate={
              isInitialGroup
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.8,
                      ease: EASINGS.easeOutQuart,
                      delay: mediaIndex * 0.1,
                    },
                  }
            }
            whileInView={
              isInitialGroup
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.8,
                      ease: EASINGS.easeOutQuart,
                      delay: mediaIndex * 0.1,
                    },
                  }
            }
            viewport={{ once: true, margin: "-10%" }}
          >
            <MediaRenderer
              className="max-h-[95vh] rounded-xl"
              media={media}
              autoPlay={isActive}
              priority={index === 0} // Only first group gets priority
              loading={index < 2 ? "eager" : "lazy"} // First two groups load eagerly
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
});

// Navigation Component - Simplified and optimized
const Navigation = memo(function Navigation({
  activeGroup,
  groups,
  isExpanded,
  onToggleExpand,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
}: NavigationProps) {
  const currentGroup = groups[activeGroup];
  const [prevIndex, setPrevIndex] = useState(activeGroup);
  const direction = activeGroup > prevIndex ? 1 : -1;

  useEffect(() => {
    setPrevIndex(activeGroup);
  }, [activeGroup]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 hidden px-3 pb-4 md:bottom-4 md:block md:px-4"
      initial={{ y: 25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 25, opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: EASINGS.easeOutQuart,
      }}
    >
      <motion.div
        layout
        className="mx-auto h-min w-min overflow-hidden bg-white/60 p-1 drop-shadow-2xl backdrop-blur-2xl"
        animate={{
          borderRadius: isExpanded ? 32 : 16,
        }}
        transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
      >
        <motion.div
          layout
          layoutId="nav-background"
          className="relative overflow-hidden bg-white"
          animate={{
            borderRadius: isExpanded ? 28 : 12,
          }}
          transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isExpanded ? (
              <motion.button
                layout
                key="collapsed"
                className="flex w-full items-center justify-between gap-2 px-4 py-2 focus:outline-none"
                onClick={onToggleExpand}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
              >
                <span className="whitespace-nowrap opacity-50">
                  {currentGroup.heading}
                </span>
                <XIcon className="h-4 w-4 shrink-0 rotate-45 opacity-60" />
              </motion.button>
            ) : (
              <motion.div
                layout
                key="expanded"
                className="relative w-screen max-w-[calc(100vw-2rem)] md:max-w-[400px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
              >
                <div className="flex w-full flex-col gap-3 px-6 py-6">
                  <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                      key={`content-${activeGroup}`}
                      initial={{ opacity: 0, y: direction * 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: direction * -20 }}
                      transition={{
                        duration: 0.4,
                        ease: EASINGS.easeOutQuart,
                      }}
                    >
                      {currentGroup.heading && (
                        <div className="mb-2 flex w-full items-center justify-between text-lg">
                          <h4 className="opacity-70">{currentGroup.heading}</h4>
                        </div>
                      )}
                      {currentGroup.caption && (
                        <p className="text-sm opacity-50">
                          {currentGroup.caption}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex gap-1">
                    <button
                      onClick={canGoPrev ? onPrev : undefined}
                      disabled={!canGoPrev}
                      className="rounded-full bg-white/80 p-2 transition-opacity hover:bg-white/90 disabled:opacity-30"
                    >
                      <ChevronUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={canGoNext ? onNext : undefined}
                      disabled={!canGoNext}
                      className="rounded-full bg-white/80 p-2 transition-opacity hover:bg-white/90 disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={onToggleExpand}
                  className={`absolute right-6 ${
                    currentGroup.heading ? "top-[1.75rem]" : "top-[2.25rem]"
                  }`}
                >
                  <XIcon className="h-4 w-4 opacity-60" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

Navigation.displayName = "Navigation";

// Main Component - Optimized with proper hooks and memoization
export default function ProjectCaseStudy({ data }: ProjectCaseStudyProps) {
  const router = useRouter();
  const project = data.projects?.[0] as CaseStudy & { _key: string };
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Initialize Lenis for case study
  useEffect(() => {
    if (!containerRef.current) return;

    lenisRef.current = new Lenis({
      wrapper: containerRef.current,
      content: containerRef.current,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Smooth scroll helper
  const scrollToGroup = useCallback((index: number) => {
    const element = document.getElementById(`media-group-${index}`);
    if (!element || !containerRef.current) return;

    const container = containerRef.current;
    const elementBounds = element.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    const targetScroll =
      container.scrollTop +
      elementBounds.top -
      containerBounds.height / 2 +
      elementBounds.height / 2;

    animate(container.scrollTop, targetScroll, {
      duration: 1.2,
      ease: [0.32, 0.72, 0, 1], // Custom easing for super smooth movement
      onUpdate: (value) => {
        container.scrollTop = value;
      },
    });
  }, []);

  // Group navigation helper
  const findNextGroup = useCallback(
    (currentIndex: number, direction: 1 | -1, onlyWithCaption = false) => {
      if (!project.mediaGroups) return null;
      let index = currentIndex + direction;

      while (index >= 0 && index < project.mediaGroups.length) {
        const group = project.mediaGroups[index];
        if (!onlyWithCaption || (group.heading && group.caption)) {
          return index;
        }
        index += direction;
      }
      return null;
    },
    [project.mediaGroups],
  );

  // Event handlers
  const handleGroupActivate = useCallback(
    (index: number) => {
      setActiveGroupIndex(index);
      requestAnimationFrame(() => scrollToGroup(index));
    },
    [scrollToGroup],
  );

  const handleGroupScroll = useCallback((index: number) => {
    setActiveGroupIndex(index);
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = findNextGroup(activeGroupIndex, 1, isZoomed);
    if (nextIndex !== null) handleGroupActivate(nextIndex);
  }, [activeGroupIndex, isZoomed, findNextGroup, handleGroupActivate]);

  const handlePrev = useCallback(() => {
    const prevIndex = findNextGroup(activeGroupIndex, -1, isZoomed);
    if (prevIndex !== null) handleGroupActivate(prevIndex);
  }, [activeGroupIndex, isZoomed, findNextGroup, handleGroupActivate]);

  const handleClose = useCallback(() => {
    if (data.slug?.current) {
      router.push(`/work/${data.slug.current}`, undefined, {
        shallow: true,
      });
    }
  }, [router, data.slug]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.querySelector('[role="dialog"]')) return;

      switch (e.code) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation(); // Stop event from bubbling to Dialog
          if (isZoomed) {
            setIsZoomed(false);
            return;
          }
          if (data.slug?.current) {
            router.push(`/work/${data.slug.current}`, undefined, {
              shallow: true,
            });
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          handlePrev();
          break;
        case "ArrowDown":
          e.preventDefault();
          handleNext();
          break;
        case "Space":
        case "Enter":
          e.preventDefault();
          setIsZoomed((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isZoomed, handleNext, handlePrev, router, data.slug]);

  // Memoize mediaGroups to prevent unnecessary re-renders
  const mediaGroups = useMemo(
    () =>
      project.mediaGroups?.map((group, index) => ({
        key: `${group.heading}-${index}`,
        group,
        index,
      })),
    [project.mediaGroups],
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto overscroll-none">
      <div className="hide-scrollbar px-4 py-8 xl:px-8">
        <div className="mb-8 flex justify-end">
          <motion.button
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="rounded-full p-2 text-neutral-400 transition-colors hover:text-neutral-600"
            tabIndex={-1}
          >
            <XIcon className="h-5 w-5" />
          </motion.button>
        </div>

        <motion.div
          {...STAGGER_ANIMATION}
          className="mb-8 space-y-4 py-24 text-center md:py-48 xl:py-64"
        >
          <motion.h1 {...FADE_UP_ANIMATION} className="text-4xl xl:text-5xl">
            {project.heading}
          </motion.h1>
          {/* {project.description && (
            <motion.p
              {...FADE_UP_ANIMATION}
              className="text-lg text-neutral-500"
            >
              {project.description}
            </motion.p>
          )} */}
        </motion.div>

        <motion.div
          {...STAGGER_ANIMATION}
          className="flex flex-col gap-4 xl:gap-4"
        >
          {mediaGroups?.map(({ key, group, index }) => (
            <motion.div key={key} {...FADE_UP_ANIMATION}>
              <MediaGroup
                id={`media-group-${index}`}
                group={group}
                index={index}
                isActive={activeGroupIndex === index}
                isZoomed={isZoomed}
                activeGroupIndex={activeGroupIndex}
                onScroll={handleGroupScroll}
                onActivate={() => handleGroupActivate(index)}
              />
            </motion.div>
          ))}

          {project.credits && (
            <motion.div
              className="mx-auto my-72 grid w-96 grid-cols-2 gap-y-6 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: EASINGS.easeOutQuart,
                },
              }}
              viewport={{ once: true, margin: "-10%" }}
            >
              {project.credits.map((credit, index) => (
                <Fragment key={index}>
                  <div className="flex flex-row">
                    {credit.role}
                    <div className="mx-4 h-0 flex-grow translate-y-2 border-b border-gray-200" />
                  </div>
                  <div className="opacity-50">
                    {credit.names?.map((name, idx) => (
                      <div key={idx}>{name}</div>
                    ))}
                  </div>
                </Fragment>
              ))}
            </motion.div>
          )}

          <motion.button
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mx-auto mb-24 mt-8 text-sm text-neutral-400 transition-colors hover:text-neutral-600"
          >
            Close
          </motion.button>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {project.mediaGroups?.[activeGroupIndex]?.heading && (
            <Navigation
              activeGroup={activeGroupIndex}
              groups={project.mediaGroups ?? []}
              isExpanded={isZoomed}
              onToggleExpand={() => setIsZoomed((prev) => !prev)}
              onNext={handleNext}
              onPrev={handlePrev}
              canGoNext={findNextGroup(activeGroupIndex, 1, isZoomed) !== null}
              canGoPrev={findNextGroup(activeGroupIndex, -1, isZoomed) !== null}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
