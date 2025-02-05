import { useState, useEffect, useCallback } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ExpandIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { ABOUT_QUERY } from "@/sanity/lib/queries";
import { About } from "@/sanity/types";
import { MediaItem } from "@/sanity/lib/media";
import { MediaRenderer } from "@/components/media-renderer";
import { EASINGS } from "@/components/animations/easings";
import { useMotionValue, useTransform } from "framer-motion";

interface TeamMember {
  _key: string;
  name: string;
  role: string;
  bio: string;
  media: MediaItem[];
  qaPairs: {
    _key: string;
    question: string;
    answer: string;
  }[];
}

function PersonInfo({
  person,
  isExpanded,
  onToggle,
  isPreview,
}: {
  person: TeamMember;
  isExpanded: boolean;
  onToggle: () => void;
  isPreview: boolean;
}) {
  return (
    <motion.div
      layout
      layoutId="person-info-root"
      role="dialog"
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 md:bottom-4 md:px-4"
      style={{ transformOrigin: "bottom center" }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isPreview ? 1.03 : 1,
      }}
      transition={{
        duration: 0.6,
        ease: EASINGS.easeOutQuart,
      }}
    >
      <motion.div
        layout
        layoutId="person-info-container"
        className={cn(
          "mx-auto h-min w-min overflow-hidden bg-white/50 p-1 drop-shadow-2xl backdrop-blur-md",
        )}
        animate={{
          borderRadius: isExpanded ? 32 : 16,
        }}
        transition={{
          duration: 0.6,
          ease: EASINGS.easeOutQuart,
        }}
        style={{ transformOrigin: "bottom center" }}
      >
        <motion.div
          layout
          layoutId="person-info-background"
          onClick={onToggle}
          className="relative flex w-screen max-w-[calc(100vw-2rem)] cursor-pointer flex-col items-center justify-between space-y-4 overflow-hidden bg-white/30 p-6 backdrop-blur-2xl md:max-w-[400px]"
          animate={{
            borderRadius: isExpanded ? 28 : 12,
          }}
          transition={{
            duration: 0.6,
            ease: EASINGS.easeOutQuart,
          }}
          style={{ transformOrigin: "bottom center" }}
        >
          <motion.div
            layout="position"
            layoutId="info-container"
            className={cn(
              "flex w-full",
              isExpanded
                ? "flex-col items-center"
                : "items-center justify-between",
            )}
          >
            <motion.div
              layout="position"
              layoutId="text-content"
              className={cn("flex flex-col", isExpanded && "items-center")}
              transition={{
                layout: {
                  duration: 0.3,
                  ease: EASINGS.easeOutQuart,
                },
                ease: EASINGS.easeOutQuart,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  layout
                  key={person._key + "-" + isExpanded}
                  initial={{ filter: "blur(2px)" }}
                  animate={{ filter: "blur(0px)" }}
                  exit={{ filter: "blur(2px)" }}
                  transition={{
                    duration: 0.1,
                    ease: EASINGS.easeOutQuart,
                  }}
                  className={cn(
                    "flex flex-col",
                    isExpanded ? "items-center" : "items-start",
                  )}
                >
                  <span className="whitespace-nowrap font-medium text-neutral-500">
                    {person.name}
                  </span>
                  <span className="whitespace-nowrap text-neutral-400">
                    {person.role}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <ExpandIcon className="h-4 w-4 text-neutral-500" />
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                key={person._key}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{
                  duration: 0.4,
                  ease: EASINGS.easeOutQuart,
                  layout: { duration: 0.3 },
                }}
                className="flex w-full flex-col space-y-6"
                layout="position"
              >
                <motion.p
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{
                    duration: 0.4,
                    ease: EASINGS.easeOutQuart,
                  }}
                  className="px-8 text-center text-neutral-500"
                >
                  {person.bio}
                </motion.p>
                <div className="flex items-start gap-1 self-stretch">
                  {person.qaPairs.map((qaPair, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(4px)" }}
                      transition={{
                        duration: 0.4,
                        ease: EASINGS.easeOutQuart,
                      }}
                      className="flex aspect-square h-full w-full flex-col items-center justify-center rounded-2xl border-[1px] border-neutral-200 bg-neutral-400/5 p-4 text-center"
                    >
                      <div className="pb-1 text-sm text-neutral-500">
                        {qaPair.question}
                      </div>
                      <div className="text-md text-neutral-400">
                        {qaPair.answer}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutPage({ aboutData }: { aboutData: About }) {
  // --- Utilities ---
  const getMiddleIndex = (length: number) => Math.floor((length - 1) / 2);
  const startIndex = aboutData.team ? getMiddleIndex(aboutData.team.length) : 0;

  // --- Carousel Configuration ---
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    axis: "x",
    direction: "ltr",
    startIndex,
    dragFree: true,
    inViewThreshold: 0.7,
  });

  // --- State Management ---
  const [selectedIndex, setSelectedIndex] = useState(startIndex);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // Keep original scroll handler
  const handleScroll = useCallback(
    (event: WheelEvent) => {
      // 1. Early return if carousel isn't ready or is already scrolling
      if (!emblaApi || isScrolling) return;
      event.preventDefault();

      // 2. Detect if user is using a trackpad
      const isTrackpad =
        Math.abs(event.deltaX) !== 0 || // Trackpads often have horizontal scroll
        Math.abs(event.deltaY) < 50; // Trackpads have smaller delta values

      // 3. Get scroll values
      const deltaX = event.deltaX; // Horizontal scroll amount
      const deltaY = event.deltaY; // Vertical scroll amount

      // 4. Calculate the strongest scroll direction
      const delta = isTrackpad
        ? Math.max(Math.abs(deltaX), Math.abs(deltaY)) // For trackpad, use strongest direction
        : Math.abs(deltaY); // For mouse wheel, only care about vertical

      // 5. Set different sensitivity thresholds
      const threshold = isTrackpad ? 15 : 35; // Trackpad needs lower threshold

      // 6. Only proceed if scroll is strong enough
      if (delta > threshold) {
        setIsScrolling(true);

        requestAnimationFrame(() => {
          // 7. Determine scroll direction
          const direction = isTrackpad
            ? Math.abs(deltaX) > Math.abs(deltaY) // If trackpad, check which direction is stronger
              ? deltaX // Use horizontal if stronger
              : deltaY // Use vertical if stronger
            : deltaY; // For mouse wheel, always use vertical

          // 8. Calculate target slide
          const currentIndex = emblaApi.selectedScrollSnap();
          const targetIndex =
            direction > 0
              ? Math.min(currentIndex + 1, emblaApi.scrollSnapList().length - 1) // Next slide
              : Math.max(currentIndex - 1, 0); // Previous slide

          // 9. Perform the scroll
          emblaApi.scrollTo(targetIndex);

          // 10. Reset scrolling state after a delay
          setTimeout(
            () => {
              setIsScrolling(false);
            },
            isTrackpad ? 100 : 300, // Shorter delay for trackpad
          );
        });
      }
    },
    [emblaApi, isScrolling],
  );

  // --- Effects ---
  // Carousel initialization and cleanup
  useEffect(() => {
    if (!emblaApi) return;

    const timeoutId = setTimeout(() => setIsLoaded(true), 100);
    const onSelect = () => {
      requestAnimationFrame(() => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    };

    emblaApi.on("select", onSelect);
    const rootNode = emblaApi.rootNode();
    rootNode.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      clearTimeout(timeoutId);
      rootNode.removeEventListener("wheel", handleScroll);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.querySelector('[role="dialog"]')) return;

      switch (e.code) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          if (isExpanded) {
            setIsExpanded(false);
          }
          break;
        case "Enter":
        case "Space":
        case "Tab":
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          if (emblaApi) {
            const currentIndex = emblaApi.selectedScrollSnap();
            const prevIndex = Math.max(currentIndex - 1, 0);
            emblaApi.scrollTo(prevIndex);
          }
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          if (emblaApi) {
            const currentIndex = emblaApi.selectedScrollSnap();
            const nextIndex = Math.min(
              currentIndex + 1,
              emblaApi.scrollSnapList().length - 1,
            );
            emblaApi.scrollTo(nextIndex);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isExpanded, emblaApi]);

  // --- Render ---
  return (
    <motion.div className="fixed inset-0">
      {/* Full page gradient container */}
      <div className="main-gradient absolute inset-0">
        {/* Carousel container */}
        <div ref={emblaRef} className="h-full overflow-hidden">
          <motion.div
            className="flex h-full items-center mix-blend-multiply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {aboutData.team?.map((person, i) => {
              return (
                <motion.div
                  key={person._key}
                  className="relative flex h-full w-full flex-[0_0_100%] items-center justify-center mix-blend-multiply md:flex-[0_0_25%]"
                  initial={{
                    scale: 0.8,
                    filter: "blur(12px)",
                    opacity: 0,
                  }}
                  animate={{
                    scale: selectedIndex === i ? 1 : 0.9,
                    filter: selectedIndex === i ? "blur(0px)" : "blur(8px)",
                    opacity: isLoaded ? (selectedIndex === i ? 1 : 0.65) : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: EASINGS.easeOutQuart,
                  }}
                  onClick={() => {
                    setPreviewIndex(null);
                    emblaApi?.scrollTo(i);
                    setSelectedIndex(i);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {person.media?.[0] && (
                    <MediaRenderer
                      className="object-contain mix-blend-multiply"
                      media={person.media[0]}
                      autoPlay={true}
                      disableThumbnail={true}
                      forcedVideoPlayback={true}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Navigation/Bio Card */}
      <PersonInfo
        person={aboutData.team?.[previewIndex ?? selectedIndex] as TeamMember}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        isPreview={previewIndex !== null}
      />

      {/* Updated Dots Navigation */}
      {!isExpanded && (
        <div className="absolute bottom-36 left-1/2 z-10 -translate-x-1/2 md:bottom-40">
          <motion.div className="dots-container flex px-4 py-2">
            {aboutData.team?.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setPreviewIndex(null);
                  emblaApi?.scrollTo(index);
                  setSelectedIndex(index);
                }}
                onHoverStart={() => setPreviewIndex(index)}
                onHoverEnd={() => setPreviewIndex(null)}
                className="relative px-2 py-3"
              >
                <motion.div
                  className="h-2 w-2 rounded-full bg-neutral-500"
                  animate={{
                    scale:
                      index === previewIndex || index === selectedIndex
                        ? 1.5
                        : 1,
                    opacity:
                      index === previewIndex || index === selectedIndex
                        ? 1
                        : 0.5,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: EASINGS.easeOutQuart,
                  }}
                />
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const aboutData = await client.fetch(ABOUT_QUERY);

  return {
    props: {
      aboutData,
    },
    revalidate: 60,
  };
};
