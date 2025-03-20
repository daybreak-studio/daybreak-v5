import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ExpandIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { ABOUT_QUERY } from "@/sanity/lib/queries";
import { About } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { EASINGS } from "@/components/animations/easings";
import CareersPill from "@/components/job/careers-pill";
import ScrollDrawer from "@/components/scroll-drawer";
import Lenis from "lenis";
import Footer from "@/components/footer";
import { PortableText, PortableTextProps } from "@portabletext/react";
import Reveal from "@/components/animations/reveal";
import CarouselComponent from "@/components/carousel";
import { MediaItem } from "@/sanity/lib/media";

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
  isLoaded,
  onClick,
}: {
  person: TeamMember;
  index: number;
  selectedIndex: number;
  isLoaded: boolean;
  onClick: () => void;
}) => (
  <motion.div
    key={person._key}
    className="relative flex h-full w-full flex-[0_0_75%] items-center justify-center mix-blend-multiply xl:flex-[0_0_25%]"
    initial={{ scale: 0.8, filter: "blur(12px)", opacity: 0 }}
    animate={{
      scale: selectedIndex === index ? 1 : 0.9,
      filter: selectedIndex === index ? "blur(0px)" : "blur(8px)",
      opacity: isLoaded ? (selectedIndex === index ? 1 : 0.65) : 0,
    }}
    transition={{ duration: 0.6, ease: EASINGS.easeOutQuart }}
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    {person.media?.[0] && (
      <MediaRenderer
        className="object-contain mix-blend-multiply"
        media={person.media[0]}
        autoPlay={true}
        disableThumbnails
      />
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // Effects
  useEffect(() => {
    if (!emblaApi) return;

    const timeoutId = setTimeout(() => setIsLoaded(true), 100);
    const onSelect = () => {
      requestAnimationFrame(() => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    };

    emblaApi.on("select", onSelect);

    return () => {
      clearTimeout(timeoutId);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

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
      emblaApi?.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaApi],
  );

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  console.log(aboutData);

  // Handles text rendering for the CMS text.
  // We are applying reveal animation and controlling font size.
  // const components: PortableTextProps["components"] = {
  //   block: {
  //     normal: ({ children, index }) => (
  //       <div>
  //         <p className="mb-8 text-2xl text-neutral-400 md:text-3xl xl:text-4xl xl:leading-tight 3xl:text-5xl 3xl:leading-[3.25rem]">
  //           {children}
  //         </p>
  //       </div>
  //     ),
  //   },
  //   types: {
  //     carousel: ({ value }: { value: { media: MediaItem[] } }) => {
  //       return <CarouselComponent media={value.media} />;
  //     },
  //   },
  // };

  return (
    <main className="relative">
      <motion.div className="fixed inset-0">
        <CareersPill jobs={aboutData.jobs} />
        {/* Carousel */}
        <div className="main-gradient absolute inset-0">
          <div ref={emblaRef} className="h-full overflow-hidden">
            <motion.div
              className="flex h-full items-center mix-blend-multiply"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {aboutData.team?.map((person, i) => (
                <CarouselSlide
                  key={person._key}
                  person={person}
                  index={i}
                  selectedIndex={selectedIndex}
                  isLoaded={isLoaded}
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

      {/* <ScrollDrawer>
        <div className="space-y-16 pt-20 md:space-y-32 xl:space-y-48">
          <Reveal className="px-8 pb-8 md:w-10/12 md:px-20 xl:w-9/12 xl:px-36 2xl:w-7/12">
            {aboutData.introduction && (
              <PortableText
                value={aboutData.introduction}
                components={components}
              />
            )}
          </Reveal>

          <Reveal>
            {aboutData.media && <CarouselComponent media={aboutData.media} />}
          </Reveal>
        </div>

        <Footer />
      </ScrollDrawer> */}
    </main>
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
  // Move hooks to the top level, before any conditional returns
  const isAnimating = useRef(false);

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
  }, [isExpanded, isPreview, onToggle, person, team, onSlideClick]);

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
        }}
        transition={{
          duration: 0.6,
          ease: EASINGS.easeOutQuart,
        }}
        onAnimationStart={() => {
          isAnimating.current = true;
        }}
        onAnimationComplete={() => {
          isAnimating.current = false;
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
                  <div className="flex items-start gap-1 self-stretch">
                    {person.qaPairs?.map((qaPair: QAPair, index: number) => (
                      <motion.div
                        key={qaPair._key || index}
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
    </AnimatePresence>
  );
}
