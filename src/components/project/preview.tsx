import { motion, AnimatePresence } from "framer-motion";
import { Preview, Clients } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia, getMediaAssetId } from "@/sanity/lib/media";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGE_ANIMATION } from "./animations";
import { EASINGS } from "../animations/easings";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/router";

interface ProjectPreviewProps {
  data: Clients;
}

const chevronButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
  tap: {
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export default function ProjectPreview({ data }: ProjectPreviewProps) {
  const router = useRouter();
  const { slug } = router.query;
  const [clientSlug, projectSlug] = Array.isArray(slug)
    ? slug
    : [slug, undefined];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const project = data.projects?.find((p) => {
    if (projectSlug) {
      return p._type === "preview" && p.category === projectSlug;
    }
    return p._type === "preview";
  }) as Preview;

  const mediaArray = project?.media || [];

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
      setCurrentIndex(index);
    },
    [emblaApi],
  );

  const handlePrevious = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? mediaArray.length - 1 : currentIndex - 1;
    scrollTo(newIndex);
  }, [currentIndex, mediaArray.length, scrollTo]);

  const handleNext = useCallback(() => {
    const newIndex =
      currentIndex === mediaArray.length - 1 ? 0 : currentIndex + 1;
    scrollTo(newIndex);
  }, [currentIndex, mediaArray.length, scrollTo]);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on("select", onSelect);

      // Cleanup
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default space scroll behavior
      if (e.code === "Space") {
        e.preventDefault();
      }

      switch (e.code) {
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "Space":
          handleNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  if (!project) {
    return null;
  }

  const mediaAsset = mediaArray[currentIndex];
  const assetId = getMediaAssetId(mediaAsset);

  return (
    <div className="flex flex-col p-8 md:flex-row md:space-x-8">
      <motion.div
        className="order-2 pt-4 md:order-1 md:w-2/3 md:pt-0"
        {...IMAGE_ANIMATION}
        layout
        layoutId={assetId || undefined}
      >
        {/* Desktop View */}
        <div className="hidden md:block">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              onClick={handleNext}
              className="cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
              key={currentIndex}
              initial={{ opacity: 0, filter: "blur(16px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(16px)" }}
              transition={{
                duration: 0.8,
                ease: EASINGS.easeOutQuart,
              }}
            >
              <MediaRenderer
                className="frame-inner max-h-[700px] cursor-e-resize transition-shadow duration-300 hover:shadow-xl hover:shadow-neutral-100"
                media={mediaAsset}
                autoPlay={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {mediaArray.map((media, index) => (
                <div className="h-full w-full" key={media._key}>
                  <MediaRenderer
                    fill
                    className="frame-inner"
                    media={media}
                    autoPlay={index === currentIndex}
                  />
                </div>
              ))}
            </div>
          </div>
          {mediaArray.length > 1 && (
            <div className="flex justify-center space-x-2 pt-6">
              {mediaArray.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    currentIndex === index
                      ? "bg-neutral-500"
                      : "bg-neutral-300",
                  )}
                  onClick={() => {
                    emblaApi?.scrollTo(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
      <motion.div className="order-1 flex flex-col justify-between md:order-2 md:w-1/3">
        <motion.div
          initial={{ filter: "blur(10px)" }}
          animate={{ filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
          className={cn(
            "hidden items-center space-x-2 md:flex",
            mediaArray.length === 1 && "invisible",
          )}
        >
          <motion.button
            onClick={handlePrevious}
            variants={chevronButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="rounded-full p-1"
            tabIndex={-1}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 text-neutral-500" />
          </motion.button>
          {mediaArray.map((media, index) => (
            <motion.button
              key={media._key}
              onClick={() => scrollTo(index)}
              animate={{ scale: currentIndex === index ? 1.2 : 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                duration: 0.1,
                ease: EASINGS.easeOutQuart,
              }}
              className={cn(
                "relative rounded-md transition-all duration-200 hover:ring-2 hover:ring-neutral-300",
                currentIndex === index && "ring-2 ring-neutral-400",
              )}
            >
              <MediaRenderer media={media} className="h-5 w-5 rounded-md" />
            </motion.button>
          ))}
          <motion.button
            onClick={handleNext}
            variants={chevronButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="rounded-full p-1"
            tabIndex={-1}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 text-neutral-500" />
          </motion.button>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
              },
            },
          }}
          transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
          className="flex flex-col space-y-2 self-end md:space-y-4"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { duration: 1, ease: EASINGS.easeOutQuart },
              },
            }}
            className="text-2xl font-medium text-neutral-500 md:text-xl lg:text-2xl"
          >
            {project.heading}
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { duration: 1, ease: EASINGS.easeOutQuart },
              },
            }}
            className="pb-2 text-xs text-neutral-400 md:text-xs xl:text-base"
          >
            {project.caption}
          </motion.p>
          {project.link && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  transition: { duration: 1, ease: EASINGS.easeOutQuart },
                },
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: EASINGS.easeOutQuart }}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border-[1px] border-neutral-100 bg-neutral-600/5 p-4 transition-colors duration-500 hover:border-[1px] hover:border-neutral-600/10"
            >
              <div className="relative h-[16px] overflow-hidden">
                <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-[16px]">
                  <span className="text-xs leading-4">Visit site</span>
                  <span className="text-xs leading-4">{project.link}</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-all duration-200 group-hover:rotate-45" />
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
