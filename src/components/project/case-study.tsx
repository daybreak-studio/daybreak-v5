import { motion, animate, easeOut, useInView } from "framer-motion";
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
        // opacity: isZoomed ? (isActive ? 1 : 0.2) : 1,
        scale: isZoomed ? (isActive ? 0.95 : 0.85) : 1,
      }}
      whileHover={{
        scale: isZoomed ? (isActive ? 0.95 : 0.88) : 0.99,
        // opacity: isZoomed ? (isActive ? 1 : 0.3) : 1,
      }}
      transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
      className={cn(
        "grid origin-center cursor-pointer gap-4",
        group.media?.length === 1
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2",
      )}
      onClick={onActivate}
    >
      {group.media?.map((media, mediaIndex) => (
        <motion.div
          // {...IMAGE_ANIMATION}
          // layoutId={getMediaAssetId(media) || undefined}
          key={`${index}-${mediaIndex}`}
        >
          <MediaRenderer
            className="max-h-[95vh] rounded-xl"
            media={media}
            autoPlay={isActive}
            priority={true}
          />
        </motion.div>
      ))}
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
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 md:bottom-4 md:px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: EASINGS.easeOutExpo,
        delay: 0.8,
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

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Smooth scroll helper
  const scrollToGroup = useCallback((index: number) => {
    const element = document.getElementById(`media-group-${index}`);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
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
      setIsZoomed(true);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.querySelector('[role="dialog"]')) return;

      switch (e.code) {
        case "Escape":
          e.preventDefault();
          if (isZoomed) setIsZoomed(false);
          else if (data.slug?.current) {
            router.push(`/work/${data.slug.current}`, undefined, {
              shallow: true,
            });
          }
          break;
        case "ArrowUp":
          handlePrev();
          break;
        case "ArrowDown":
          handleNext();
          break;
        case "Space":
          setIsZoomed((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    <div
      ref={containerRef}
      className="hide-scrollbar h-screen overflow-y-auto px-4 py-8 pt-24 xl:px-8 xl:pt-32"
    >
      <motion.h1
        className="mb-8 py-24 text-center text-4xl xl:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        {project.heading}
      </motion.h1>

      <div className="flex flex-col gap-4 xl:gap-4">
        {mediaGroups?.map(({ key, group, index }) => (
          <MediaGroup
            key={key}
            id={`media-group-${index}`}
            group={group}
            index={index}
            isActive={activeGroupIndex === index}
            isZoomed={isZoomed}
            activeGroupIndex={activeGroupIndex}
            onScroll={handleGroupScroll}
            onActivate={() => handleGroupActivate(index)}
          />
        ))}

        {project.credits && (
          <motion.div
            className="mx-auto my-72 grid w-96 grid-cols-2 gap-y-6 text-sm"
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
                  {credit.names?.map((name, idx) => (
                    <div key={idx}>{name}</div>
                  ))}
                </div>
              </Fragment>
            ))}
          </motion.div>
        )}
      </div>

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
  );
}
