import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ExpandIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { ABOUT_QUERY } from "@/sanity/lib/queries";
import { About } from "@/sanity/types";
import { MediaItem } from "@/sanity/lib/media";
import { MediaRenderer } from "@/components/media-renderer";

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
}: {
  person: TeamMember;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      layoutId="person-container"
      onClick={onToggle}
      className="flex w-[calc(100vw-2rem)] cursor-pointer flex-col items-center justify-between space-y-4 overflow-hidden border bg-white/60 p-6 backdrop-blur-xl md:w-96"
      style={{ borderRadius: 16 }}
    >
      <AnimatePresence mode="popLayout">
        {isExpanded ? (
          <motion.div
            layout
            layoutId={person.name}
            className="flex flex-col text-center"
          >
            <motion.h2
              key={person.name}
              initial={{ filter: "blur(2px)" }}
              animate={{ filter: "blur(0px)" }}
              exit={{ filter: "blur(2px)" }}
              layout="position"
              className="whitespace-nowrap font-medium text-stone-500"
            >
              {person.name}
            </motion.h2>
            <motion.h2
              key={person.role}
              initial={{ filter: "blur(2px)" }}
              animate={{ filter: "blur(0px)" }}
              exit={{ filter: "blur(2px)" }}
              layout="position"
              className="whitespace-nowrap text-stone-400"
            >
              {person.role}
            </motion.h2>
          </motion.div>
        ) : (
          <motion.div
            layout
            layoutId={person.name}
            className="flex w-full items-center justify-between"
          >
            <div className="flex flex-col">
              <motion.div
                key={person.name}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-stone-500"
              >
                {person.name}
              </motion.div>
              <motion.div
                key={person.role}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-stone-400"
              >
                {person.role}
              </motion.div>
            </div>
            <motion.div
              key={"state: " + isExpanded}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ExpandIcon className="h-4 w-4 text-stone-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {isExpanded && (
          <motion.div
            key={person._key}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col space-y-6"
            layout="position"
          >
            <p className="px-8 text-center text-stone-500">{person.bio}</p>
            <div className="flex items-start gap-1 self-stretch">
              {person.qaPairs.map((qaPair, index) => (
                <div
                  key={index}
                  className="flex aspect-square h-full w-full flex-col items-center justify-center rounded-2xl border-[1px] border-stone-200/50 bg-stone-200/25 p-4 text-center"
                >
                  <div className="pb-1 text-sm text-stone-500">
                    {qaPair.question}
                  </div>
                  <div className="text-md text-stone-700">{qaPair.answer}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AboutPage({ aboutData }: { aboutData: About }) {
  console.log(aboutData);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      containScroll: false,
      axis: "x",
      direction: "ltr",
      startIndex: 0,
    },
    [WheelGesturesPlugin()],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (emblaApi) {
      setTimeout(() => setIsLoaded(true), 100);
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

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
              console.log("Person:", person);
              console.log("Person video:", person.media);
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
                    type: "tween",
                    duration: 0.6,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  {person.media?.[0] && (
                    <MediaRenderer
                      className="object-contain mix-blend-multiply"
                      media={person.media[0]}
                      autoPlay={true}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Navigation/Bio Card */}
      <div className="absolute bottom-4 z-10 flex w-full justify-center md:left-4">
        <PersonInfo
          person={aboutData.team?.[selectedIndex] as TeamMember}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
      </div>

      {/* Dots Navigation */}
      {!isExpanded && (
        <div className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2">
          <div className="flex gap-2">
            {aboutData.team?.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className="h-2 w-2 rounded-full bg-stone-500"
                animate={{
                  scale: index === selectedIndex ? 1.5 : 1,
                  opacity: index === selectedIndex ? 1 : 0.5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
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
