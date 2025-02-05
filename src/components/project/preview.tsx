import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion";
import { Preview, Clients } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { getMediaAssetId } from "@/sanity/lib/media";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGE_ANIMATION, CONTAINER_ANIMATION } from "./animations";
import { EASINGS } from "../animations/easings";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface ProjectPreviewProps {
  data: Clients;
}

// Thumbnail Navigation
const Navigation = memo(function Navigation({
  total,
  current,
  onSelect,
  mediaArray,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
  mediaArray: Preview["media"];
}) {
  if (total <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ delay: 0.4, duration: 1, ease: EASINGS.easeOutQuart }}
      className="hidden items-center space-x-2 md:flex"
    >
      <motion.button
        onClick={() => onSelect(current - 1)}
        className="rounded-full p-1 focus:outline-none focus:ring-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="h-4 w-4 text-neutral-500" />
      </motion.button>

      {mediaArray?.map((media, index) => (
        <motion.button
          key={media._key}
          onClick={() => onSelect(index)}
          animate={{ scale: current === index ? 1.2 : 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: EASINGS.easeOutQuart }}
          className={cn(
            "relative rounded-md transition-all duration-200 hover:ring-2 hover:ring-neutral-300",
            current === index && "ring-2 ring-neutral-400",
          )}
        >
          <MediaRenderer
            media={media}
            className="h-5 w-5 rounded-md"
            priority={true}
            sizes="32px"
            width={32}
            height={32}
            playsInline={true}
          />
        </motion.button>
      ))}

      <motion.button
        onClick={() => onSelect(current + 1)}
        className="rounded-full p-1 focus:outline-none focus:ring-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="h-4 w-4 text-neutral-500" />
      </motion.button>
    </motion.div>
  );
});

// Separate the ProjectInfo into its own component to defer its render
const ProjectInfo = memo(function ProjectInfo({
  heading,
  caption,
  link,
}: {
  heading?: string;
  caption?: string;
  link?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.6,
          },
        },
      }}
      className="flex flex-col space-y-2 self-end md:space-y-4"
    >
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              duration: 1,
              ease: EASINGS.easeOutQuart,
            },
          },
        }}
        className="text-2xl font-medium text-neutral-500 md:text-xl lg:text-2xl"
      >
        {heading}
      </motion.h2>
      <motion.p
        variants={{
          hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
              duration: 1,
              ease: EASINGS.easeOutQuart,
            },
          },
        }}
        className="pb-2 text-xs text-neutral-400 md:text-xs xl:text-base"
      >
        {caption}
      </motion.p>
      {link && (
        <motion.a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          variants={{
            hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
            visible: {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: {
                duration: 1,
                ease: EASINGS.easeOutQuart,
              },
            },
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: EASINGS.easeOutQuart }}
          className="group relative flex items-center justify-between overflow-hidden rounded-2xl border-[1px] border-neutral-100 bg-neutral-600/5 p-4 transition-colors duration-500 hover:border-[1px] hover:border-neutral-600/10"
        >
          <div className="relative h-[16px] overflow-hidden">
            <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-[16px]">
              <span className="text-xs leading-4">Visit site</span>
              <span className="text-xs leading-4">{link}</span>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-all duration-200 group-hover:rotate-45" />
        </motion.a>
      )}
    </motion.div>
  );
});

// Main Preview Component
export default function ProjectPreview({ data }: ProjectPreviewProps) {
  const router = useRouter();
  const { slug } = router.query;
  const [clientSlug, projectSlug] = Array.isArray(slug)
    ? slug
    : [slug, undefined];

  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  // Move project finding inside a useMemo to avoid recalculations
  const project = useMemo(
    () =>
      data.projects?.find((p) =>
        projectSlug
          ? p._type === "preview" && p.category === projectSlug
          : p._type === "preview",
      ) as Preview | undefined,
    [data.projects, projectSlug],
  );

  const mediaArray = useMemo(() => project?.media || [], [project]);

  // Move all hooks before any conditional logic
  const handleNavigate = useCallback(
    (index: number) => {
      if (!mediaArray.length) return;
      const normalizedIndex =
        ((index % mediaArray.length) + mediaArray.length) % mediaArray.length;
      setCurrentIndex(normalizedIndex);
    },
    [mediaArray.length],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();

      switch (e.code) {
        case "ArrowLeft":
          handleNavigate(currentIndex - 1);
          break;
        case "ArrowRight":
        case "Space":
          handleNavigate(currentIndex + 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, handleNavigate]);

  // Early return after all hooks
  if (!project) return null;

  const mediaAsset = mediaArray[currentIndex];
  const assetId = getMediaAssetId(mediaAsset);

  return (
    <motion.div
      className="flex flex-col overflow-hidden p-8 md:flex-row md:space-x-8"
      {...CONTAINER_ANIMATION}
    >
      <motion.div
        className="order-2 overflow-hidden pt-4 md:order-1 md:w-2/3 md:pt-0"
        {...IMAGE_ANIMATION}
        layoutId={assetId || undefined}
      >
        <div className="hidden overflow-hidden md:block">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              onClick={() => handleNavigate(currentIndex + 1)}
              className="cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
              key={currentIndex}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={EASINGS.easeOutQuart}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <MediaRenderer
                  className="frame-inner max-h-[700px] cursor-e-resize overflow-hidden"
                  media={mediaAsset}
                  autoPlay={true}
                  priority={true}
                  fill
                  loading="eager"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative overflow-hidden md:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
              bulletActiveClass: "bg-neutral-100",
              bulletClass:
                "inline-block h-2 w-2 rounded-full bg-neutral-500 mx-1",
            }}
            onSlideChange={(swiper) => handleNavigate(swiper.activeIndex)}
            className="frame-inner w-full overflow-hidden"
          >
            {mediaArray.map((media, index) => (
              <SwiperSlide key={media._key} className="overflow-hidden">
                <div className="w-full overflow-hidden">
                  <MediaRenderer
                    className="frame-inner h-full w-full overflow-hidden"
                    media={media}
                    autoPlay={index === currentIndex}
                    priority={index === currentIndex}
                    loading={index === currentIndex ? "eager" : "lazy"}
                    disableThumbnail={index !== currentIndex}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>

      <motion.div className="order-1 flex flex-col justify-between overflow-hidden md:order-2 md:w-1/3">
        <Navigation
          total={mediaArray.length}
          current={currentIndex}
          onSelect={handleNavigate}
          mediaArray={mediaArray}
        />
        <ProjectInfo
          heading={project.heading}
          caption={project.caption}
          link={project.link}
        />
      </motion.div>
    </motion.div>
  );
}
