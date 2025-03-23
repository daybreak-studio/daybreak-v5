import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  ExpandIcon,
  Dices,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { ABOUT_QUERY } from "@/sanity/lib/queries";
import { About } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { EASINGS } from "@/components/animations/easings";
import CareersPill from "@/components/job/careers-pill";
import Metadata from "@/components/metadata";

// Constants
const getMiddleIndex = (length: number) => Math.floor((length - 1) / 2);

// Update the type for team member to be more specific
type TeamMember = NonNullable<NonNullable<About["team"]>[number]>;
type QAPair = NonNullable<TeamMember["qaPairs"]>[number];

// Components
const CarouselSlide = ({
  person,
  index,
  selectedIndex,
  onClick,
}: {
  person: TeamMember;
  index: number;
  selectedIndex: number;
  onClick: () => void;
}) => (
  <motion.div
    key={person._key}
    className="relative flex h-full w-full items-center justify-center"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{
      scale: selectedIndex === index ? 1 : 0.9,
      opacity: 1,
    }}
    transition={{
      duration: 0.6,
      ease: EASINGS.easeOutQuart,
      delay: 0.3 + index * 0.2,
    }}
    onClick={onClick}
    style={{ cursor: "ew-resize" }}
  >
    {person.media?.[0] && (
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          filter: selectedIndex === index ? "blur(0px)" : "blur(8px)",
          opacity: selectedIndex === index ? 1 : 0.4,
        }}
        transition={{
          duration: 0.6,
          ease: EASINGS.easeOutQuart,
        }}
      >
        <MediaRenderer
          className="h-full w-full object-contain mix-blend-darken"
          media={person.media[0]}
          autoPlay={true}
          disableThumbnails
        />
      </motion.div>
    )}
  </motion.div>
);

// First, let's add the NavigationDots component
const NavigationDots = ({
  team,
  selectedIndex,
  previewIndex,
  onDotClick,
  onHoverStart,
  onHoverEnd,
}: {
  team?: About["team"];
  selectedIndex: number;
  previewIndex: number | null;
  onDotClick: (index: number) => void;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}) => (
  <div className="absolute bottom-36 left-1/2 z-10 hidden -translate-x-1/2 md:bottom-40 md:block">
    <motion.div className="dots-container flex px-4 py-2">
      {team?.map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onDotClick(index)}
          onHoverStart={() => onHoverStart(index)}
          onHoverEnd={onHoverEnd}
          className="relative px-2 py-3"
        >
          <motion.div
            className="h-2 w-2 rounded-full bg-neutral-500"
            animate={{
              scale:
                index === previewIndex || index === selectedIndex ? 1.5 : 1,
              opacity:
                index === previewIndex || index === selectedIndex ? 1 : 0.5,
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
);

// Main component
export default function AboutPage({ aboutData }: { aboutData: About }) {
  // const startIndex = aboutData.team ? getMiddleIndex(aboutData.team.length) : 0;
  console.log(aboutData.team);

  const startIndex = 0;

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    axis: "x",
    direction: "ltr",
    startIndex,
    dragFree: false,
    inViewThreshold: 0.7,
  });

  // State
  const [selectedIndex, setSelectedIndex] = useState(startIndex);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Effects
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      // Only update if the index actually changed
      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
      }
    };

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, selectedIndex]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!emblaApi) return;

      // Don't handle carousel navigation if modal is expanded
      if (isExpanded) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          emblaApi.scrollPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          emblaApi.scrollNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi, isExpanded]);

  // Handlers
  const handleSlideClick = useCallback(
    (index: number) => {
      setPreviewIndex(null);
      // Let the onSelect handler update selectedIndex
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <>
      <Metadata
        title="About Us | Daybreak Studio"
        description={"Meet the team at Daybreak Studio"}
      />
      <motion.div className="fixed inset-0">
        <CareersPill jobs={aboutData.jobs} />
        {/* Carousel */}
        <div className="main-gradient absolute inset-0">
          <div ref={emblaRef} className="h-full overflow-hidden">
            <motion.div
              className="grid h-full auto-cols-[75%] grid-flow-col items-center gap-4 mix-blend-multiply md:auto-cols-[50%] lg:auto-cols-[33%] xl:auto-cols-[25%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: EASINGS.easeOutQuart,
              }}
            >
              {aboutData.team?.map((person, i) => (
                <CarouselSlide
                  key={person._key}
                  person={person}
                  index={i}
                  selectedIndex={selectedIndex}
                  onClick={() => handleSlideClick(i)}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Info Card */}
        <PersonInfo
          person={aboutData.team?.[previewIndex ?? selectedIndex] || undefined}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          isPreview={previewIndex !== null}
          team={aboutData.team}
          onSlideClick={handleSlideClick}
        />

        {/* Navigation Dots */}
        {!isExpanded && (
          <NavigationDots
            team={aboutData.team}
            selectedIndex={selectedIndex}
            previewIndex={previewIndex}
            onDotClick={handleSlideClick}
            onHoverStart={setPreviewIndex}
            onHoverEnd={() => setPreviewIndex(null)}
          />
        )}
      </motion.div>
    </>
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

function PersonInfo({
  person,
  isExpanded,
  onToggle,
  isPreview,
  team,
  onSlideClick,
}: {
  person?: TeamMember;
  isExpanded: boolean;
  onToggle: () => void;
  isPreview: boolean;
  team?: About["team"];
  onSlideClick: (index: number) => void;
}) {
  const isAnimating = useRef(false);
  const [shuffledQAPairs, setShuffledQAPairs] = useState<QAPair[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [diceNumber, setDiceNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const previousIndicesRef = useRef<number[]>([]);
  const previousDiceNumberRef = useRef<number | null>(null);

  // Initialize shuffled pairs when person changes
  useEffect(() => {
    if (person?.qaPairs) {
      setShuffledQAPairs([...person.qaPairs]);
      previousIndicesRef.current = [0, 1]; // Reset previous indices when person changes
    }
  }, [person]);

  const getUniqueRandomIndices = useCallback(
    (array: NonNullable<TeamMember["qaPairs"]>, count: number) => {
      const currentIndices = previousIndicesRef.current;
      const availableIndices = Array.from(
        { length: array.length },
        (_, i) => i,
      ).filter((i) => !currentIndices.includes(i));

      // If we've used all indices, allow reusing any except the current ones
      if (availableIndices.length < count) {
        const oldIndices = currentIndices.slice();
        availableIndices.push(
          ...Array.from({ length: array.length }, (_, i) => i).filter(
            (i) => !oldIndices.includes(i),
          ),
        );
      }

      const result: number[] = [];
      while (result.length < count && availableIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        result.push(availableIndices[randomIndex]);
        availableIndices.splice(randomIndex, 1);
      }

      previousIndicesRef.current = result;
      return result;
    },
    [],
  );

  // Get a random dice number that's different from the previous one
  const getUniqueRandomDiceNumber = useCallback(() => {
    const availableNumbers = [1, 2, 3, 4, 5, 6].filter(
      (n) => n !== previousDiceNumberRef.current,
    );
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];
    previousDiceNumberRef.current = newNumber;
    return newNumber;
  }, []);

  const handleShuffle = useCallback(() => {
    if (!person?.qaPairs) return;

    // If any animation is in progress (rolling, showing number, or shaking), handle as spam
    if (isRolling || diceNumber || isShaking) {
      // Clear any existing timeouts
      clearTimeout(rollTimeoutRef.current);

      // Show new number and shuffle immediately
      const newNumber = getUniqueRandomDiceNumber();
      setDiceNumber(newNumber);

      // Get unique random indices and create new shuffled array
      const qaPairs = person.qaPairs as NonNullable<TeamMember["qaPairs"]>;
      const newIndices = getUniqueRandomIndices(qaPairs, 2);
      const newQAPairs = newIndices.map((i) => qaPairs[i]);
      setShuffledQAPairs(newQAPairs);
      setIsShaking(true);

      // Stop any rolling animation
      setIsRolling(false);
      return;
    }

    // Normal flow - start the rolling animation
    setIsRolling(true);

    // Store the timeout reference so we can clear it if needed
    rollTimeoutRef.current = setTimeout(() => {
      setIsRolling(false);
      // Show random dice number
      const newNumber = getUniqueRandomDiceNumber();
      setDiceNumber(newNumber);

      // Shuffle QA pairs after the dice number reveal animation
      setTimeout(() => {
        const qaPairs = person.qaPairs as NonNullable<TeamMember["qaPairs"]>;
        const newIndices = getUniqueRandomIndices(qaPairs, 2);
        const newQAPairs = newIndices.map((i) => qaPairs[i]);
        setShuffledQAPairs(newQAPairs);
        setIsShaking(true);
      }, 200);
    }, 1000);
  }, [
    person?.qaPairs,
    isRolling,
    getUniqueRandomIndices,
    getUniqueRandomDiceNumber,
  ]);

  // Add ref for timeout
  const rollTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (rollTimeoutRef.current) {
        clearTimeout(rollTimeoutRef.current);
      }
    };
  }, []);

  // Reset dice number after animation
  useEffect(() => {
    if (diceNumber) {
      const timer = setTimeout(() => {
        setDiceNumber(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [diceNumber]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modalElement = document.getElementById("person-info");
      const isModalFocused = document.activeElement === modalElement;

      // Always handle Escape
      if (event.key === "Escape") {
        event.preventDefault();
        if (isExpanded) {
          onToggle();
          modalElement?.focus();
        }
        return;
      }

      // Handle space and enter to toggle regardless of state
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!isPreview) {
          onToggle(); // Will toggle open/close
        }
        return;
      }

      // Handle arrow keys when expanded
      if (isExpanded && person) {
        const currentIndex =
          team?.findIndex((p) => p._key === person._key) ?? 0;

        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            // Go to previous person
            const prevIndex =
              currentIndex > 0 ? currentIndex - 1 : (team?.length ?? 0) - 1;
            onSlideClick(prevIndex);
            break;
          case "ArrowRight":
            event.preventDefault();
            // Go to next person
            const nextIndex =
              currentIndex < (team?.length ?? 0) - 1 ? currentIndex + 1 : 0;
            onSlideClick(nextIndex);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isExpanded,
    isPreview,
    onToggle,
    person,
    team,
    onSlideClick,
    handleShuffle,
  ]);

  // Early return after hooks
  if (!person) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        layoutId="person-info-root"
        className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 md:bottom-4 md:px-4"
        style={{ transformOrigin: "bottom center" }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isPreview ? 1.03 : 1,
          rotate: isShaking ? [0, -2, 2, -1, 1, 0] : 0,
          x: isShaking ? [0, -5, 5, -3, 3, 0] : 0,
        }}
        onAnimationComplete={() => setIsShaking(false)}
        transition={{
          duration: 0.6,
          ease: EASINGS.easeOutQuart,
          rotate: {
            duration: 0.4,
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          },
          x: {
            duration: 0.4,
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          },
        }}
      >
        <motion.div
          layout
          layoutId="person-info-container"
          className="mx-auto h-min w-min overflow-hidden bg-white/50 p-1 drop-shadow-2xl backdrop-blur-md"
          animate={{
            borderRadius: isExpanded ? 32 : 24,
          }}
          transition={{
            duration: 0.6,
            ease: EASINGS.easeOutQuart,
          }}
        >
          <motion.div
            id="person-info"
            layout
            layoutId="person-info-background"
            role="button"
            aria-expanded={isExpanded}
            aria-haspopup="dialog"
            aria-label={`${person.name}'s information. Press Enter to ${isExpanded ? "close" : "open"}`}
            tabIndex={0}
            onClick={() => {
              if (!isAnimating.current) {
                onToggle();
              }
            }}
            className={cn(
              "relative flex w-screen max-w-[calc(100vw-2rem)] cursor-pointer flex-col items-center justify-between space-y-4 overflow-hidden bg-white/30 p-6 backdrop-blur-2xl md:max-w-[400px]",
              !isExpanded &&
                "focus-visible:ring-2 focus-visible:ring-neutral-500 [&:focus:not(:focus-visible)]:outline-none",
            )}
            animate={{
              borderRadius: isExpanded ? 28 : 20,
            }}
            transition={{
              duration: 0.6,
              ease: EASINGS.easeOutQuart,
            }}
            style={{ transformOrigin: "bottom center" }}
          >
            <motion.div
              layout
              layoutId="info-container"
              className={cn(
                "flex w-full",
                isExpanded
                  ? "flex-col items-center"
                  : "items-center justify-between",
              )}
            >
              <motion.div
                layout
                layoutId="text-content"
                className="flex w-full flex-col"
                transition={{
                  layout: {
                    duration: 0.6,
                    ease: EASINGS.easeOutQuart,
                  },
                }}
              >
                <motion.div
                  layout
                  className={cn(
                    "flex w-full flex-col",
                    isExpanded ? "items-center" : "items-start",
                  )}
                  transition={{
                    layout: {
                      duration: 0.6,
                      ease: EASINGS.easeOutQuart,
                    },
                  }}
                >
                  <motion.span
                    layout="position"
                    key={`${person._key}-name`}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{
                      layout: { duration: 0.4, ease: EASINGS.easeOutQuart },
                      duration: 0.6,
                      ease: EASINGS.easeOutQuart,
                    }}
                    className="whitespace-nowrap font-medium text-neutral-500"
                  >
                    {person.name}
                  </motion.span>
                  <motion.span
                    layout="position"
                    key={`${person._key}-role`}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{
                      layout: { duration: 0.4, ease: EASINGS.easeOutQuart },

                      duration: 0.6,
                      ease: EASINGS.easeOutQuart,
                    }}
                    className="whitespace-nowrap text-neutral-400"
                  >
                    {person.role}
                  </motion.span>
                </motion.div>
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
                  <div className="flex flex-col space-y-4">
                    <div className="relative flex items-start gap-1 self-stretch">
                      {shuffledQAPairs
                        .slice(0, 2)
                        .map((qaPair: QAPair, index: number) => (
                          <motion.div
                            key={qaPair._key || index}
                            initial={{
                              opacity: 0,
                              filter: "blur(4px)",
                              rotate: -5,
                              x: -10,
                            }}
                            animate={{
                              opacity: 1,
                              filter: "blur(0px)",
                              rotate: 0,
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              filter: "blur(4px)",
                              rotate: 5,
                              x: 10,
                            }}
                            transition={{
                              duration: 0.4,
                              ease: EASINGS.easeOutQuart,
                              rotate: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              },
                              x: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              },
                            }}
                            className="relative flex aspect-square h-full w-full flex-col items-center justify-center rounded-2xl border-[1px] border-neutral-200 bg-neutral-400/5 p-4 text-center"
                          >
                            <div className="line-clamp-3 w-full overflow-hidden text-ellipsis break-words pb-1 text-sm text-neutral-500">
                              {qaPair.question}
                            </div>
                            <div className="line-clamp-4 w-full overflow-hidden text-ellipsis break-words text-sm text-neutral-400">
                              {qaPair.answer}
                            </div>
                          </motion.div>
                        ))}
                      <div className="absolute bottom-0 left-0 right-0 z-10 -mb-3 flex justify-center">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShuffle();
                          }}
                          className="rounded-full border-2 border-neutral-200 bg-neutral-50 p-2 text-neutral-500 hover:bg-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <AnimatePresence mode="wait">
                            {diceNumber ? (
                              <motion.div
                                key="dice-number"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                              >
                                {diceNumber === 1 && (
                                  <Dice1 className="h-4 w-4" />
                                )}
                                {diceNumber === 2 && (
                                  <Dice2 className="h-4 w-4" />
                                )}
                                {diceNumber === 3 && (
                                  <Dice3 className="h-4 w-4" />
                                )}
                                {diceNumber === 4 && (
                                  <Dice4 className="h-4 w-4" />
                                )}
                                {diceNumber === 5 && (
                                  <Dice5 className="h-4 w-4" />
                                )}
                                {diceNumber === 6 && (
                                  <Dice6 className="h-4 w-4" />
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="dices"
                                initial={{ opacity: 1, scale: 1 }}
                                animate={
                                  isRolling
                                    ? {
                                        scale: [
                                          1, 1.1, 0.9, 1.1, 0.9, 1.1, 0.9, 1,
                                        ],
                                        rotate: [
                                          0, 15, -15, 25, -25, 35, -25, 0,
                                        ],
                                        y: [0, -2, 2, -2, 2, -2, 2, 0],
                                        transition: {
                                          duration: 1,
                                          ease: "easeOut",
                                          times: [
                                            0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1,
                                          ],
                                        },
                                      }
                                    : { scale: 1, rotate: 0, y: 0 }
                                }
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                <Dices className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
