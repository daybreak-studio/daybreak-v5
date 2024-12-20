import { motion, animate, easeOut, useInView } from "framer-motion";
import { CaseStudy, Clients } from "@/sanity/types";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  Fragment,
  forwardRef,
} from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/sanity/lib/media";
import { EASINGS } from "@/components/animations/easings";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";

// Types
interface ProjectCaseStudyProps {
  data: Clients;
  imageLayoutId: string;
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
  onScroll: (index: number) => void;
  onActivate: () => void;
  layoutId?: string;
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

// MediaGroup Component - Handles individual media sections with animations and interactions
function MediaGroup({
  id,
  group,
  index,
  isActive,
  isZoomed,
  onScroll,
  onActivate,
  layoutId,
}: MediaGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: "some",
    margin: "-45% 0px -45% 0px",
  });

  useEffect(() => {
    if (isInView) {
      onScroll(index);
    }
  }, [isInView, index, onScroll]);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={false}
      animate={{
        opacity: isZoomed ? (isActive ? 1 : 0.2) : 1,
        scale: isZoomed ? (isActive ? 0.95 : 0.85) : 1,
      }}
      whileHover={{
        scale: isZoomed ? (isActive ? 0.95 : 0.88) : 0.99,
        opacity: isZoomed ? (isActive ? 1 : 0.3) : 1,
      }}
      transition={{
        duration: 0.4,
        ease: EASINGS.easeOutQuart,
      }}
      className={cn(
        "grid origin-center cursor-pointer gap-4",
        group.media?.length === 1
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2",
      )}
      onClick={onActivate}
    >
      {group.media?.map((media, mediaIndex) => (
        <MediaRenderer
          className="max-h-[95vh] rounded-xl"
          key={`${index}-${mediaIndex}`}
          media={media}
          autoPlay={true}
        />
      ))}
    </motion.div>
  );
}

// Navigation Component - Provides UI for navigating between media groups
// Handles expanded/collapsed states and animations
const Navigation = forwardRef<HTMLDivElement, NavigationProps>(
  (
    {
      activeGroup,
      groups,
      isExpanded,
      onToggleExpand,
      onNext,
      onPrev,
      canGoNext,
      canGoPrev,
    },
    ref,
  ) => {
    const [prevIndex, setPrevIndex] = useState(activeGroup);
    const direction = activeGroup > prevIndex ? 1 : -1;
    const currentGroup = groups[activeGroup];

    useEffect(() => {
      setPrevIndex(activeGroup);
    }, [activeGroup]);

    const transition = {
      duration: 0.4,
      ease: EASINGS.easeOutQuart,
    };

    const originStyles = { transformOrigin: "bottom center" };

    return (
      <motion.div
        ref={ref}
        layout
        layoutId="nav-root"
        className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[calc(0.5rem_+_env(safe-area-inset-bottom))] md:bottom-4 md:px-4"
        style={originStyles}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={transition}
      >
        <motion.div
          layout
          layoutId="nav-container"
          className="mx-auto h-min w-min overflow-hidden bg-white/60 p-1 drop-shadow-2xl backdrop-blur-2xl"
          animate={{
            borderRadius: isExpanded ? 32 : 16,
          }}
          transition={transition}
          style={originStyles}
        >
          <motion.div
            layout
            layoutId="nav-background"
            className="relative overflow-hidden bg-white"
            animate={{
              borderRadius: isExpanded ? 28 : 12,
            }}
            transition={transition}
            style={originStyles}
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
                  transition={transition}
                >
                  <span className="opacity-50">{currentGroup.heading}</span>
                  <XIcon className="h-4 w-4 rotate-45 opacity-60" />
                </motion.button>
              ) : (
                <motion.div
                  layout
                  key="expanded"
                  className="relative w-screen max-w-[calc(100vw-2rem)] md:max-w-[400px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                >
                  <div className="flex w-full flex-col gap-3 px-6 py-6">
                    <AnimatePresence mode="popLayout" custom={direction}>
                      <motion.div
                        key={`content-${activeGroup}`}
                        initial={{ opacity: 0, y: direction * 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: direction * -20 }}
                        transition={transition}
                      >
                        {currentGroup.heading && (
                          <div className="mb-2 flex w-full items-center justify-between text-lg">
                            <h4 className="opacity-70">
                              {currentGroup.heading}
                            </h4>
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
                        onClick={onPrev}
                        disabled={!canGoPrev}
                        className="rounded-full bg-white/80 p-2 transition-opacity hover:bg-white/90 disabled:opacity-30"
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={onNext}
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
  },
);

// Add display name for better debugging
Navigation.displayName = "Navigation";

// Main Component - Orchestrates the entire case study experience
export default function ProjectCaseStudy({
  data,
  imageLayoutId,
}: ProjectCaseStudyProps) {
  const router = useRouter();
  const project = data.projects?.[0] as CaseStudy & { _key: string };

  // Refs for managing scroll animations and container
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{ stop: () => void }>();

  // Track the currently visible/active media group
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  // Track whether we're in zoomed/focused mode for media viewing
  const [isZoomed, setIsZoomed] = useState(false);

  // Smoothly scroll to a media group by its index
  // Uses spring animation for natural movement
  const scrollToGroup = useCallback((index: number) => {
    const element = document.getElementById(`media-group-${index}`);
    if (!element || !containerRef.current) return;

    if (animationRef.current) {
      animationRef.current.stop();
    }

    const container = containerRef.current;
    const elementTop = element.offsetTop;
    const containerHeight = container.clientHeight;
    const elementHeight = element.clientHeight;
    const targetScroll = elementTop - (containerHeight - elementHeight) / 2;

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

  // Clean up any ongoing animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  // Handle clicking on a media group
  // Activates the group, zooms in, and smoothly scrolls to it
  const handleGroupActivate = useCallback(
    (index: number) => {
      setActiveGroupIndex(index);
      setIsZoomed(true);
      requestAnimationFrame(() => {
        scrollToGroup(index);
      });
    },
    [scrollToGroup],
  );

  // Update active group index when a group comes into view during scrolling
  const handleGroupScroll = useCallback((index: number) => {
    setActiveGroupIndex(index);
  }, []);

  // Find the next valid group in either direction
  // Used for both keyboard and button navigation
  // Can optionally filter to only groups with captions when in zoomed mode
  const findNextGroup = useCallback(
    (
      currentIndex: number,
      direction: 1 | -1, // 1 for next, -1 for previous
      onlyWithCaption: boolean = false,
    ) => {
      if (!project.mediaGroups) return null;
      let index = currentIndex + direction;

      // Keep looking in the specified direction until we find a valid group
      while (index >= 0 && index < project.mediaGroups.length) {
        const group = project.mediaGroups[index];
        // In normal mode, accept any group
        // In zoom mode, only accept groups with both heading and caption
        if (!onlyWithCaption || (group.heading && group.caption)) {
          return index;
        }
        index += direction;
      }
      return null; // No valid group found
    },
    [project.mediaGroups],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.querySelector('[role="dialog"]')) return;

      switch (e.code) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          if (isZoomed) {
            setIsZoomed(false);
          } else {
            const clientSlug = data.slug?.current;
            if (clientSlug) {
              router.push(`/work/${clientSlug}`, undefined, { shallow: true });
            }
          }
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
  }, [
    isZoomed,
    activeGroupIndex,
    findNextGroup,
    scrollToGroup,
    router,
    data.slug,
  ]);

  return (
    <motion.div
      ref={containerRef}
      className="hide-scrollbar h-screen overflow-y-auto px-4 py-8 pt-24 xl:px-8 xl:pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      <motion.h1
        className="mb-8 py-24 text-center text-4xl xl:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        {project.heading}
      </motion.h1>

      <div className="flex flex-col gap-4 xl:gap-8">
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
                  {credit.names?.map((name, index) => (
                    <div key={index}>{name}</div>
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
