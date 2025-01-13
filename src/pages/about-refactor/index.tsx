import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ExpandIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Team data from original data.tsx
const people = [
  {
    id: "1",
    name: "Khadija",
    role: "Developer",
    bio: "Khadija is a developer",
    video: "/team/Khadija - V5.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Brown",
      },
      {
        question: "What is your favorite food?",
        answer: "Salad",
      },
    ],
  },
  {
    id: "2",
    name: "Kiran",
    role: "Designer",
    bio: "Kiran is a designer",
    video: "/team/Kiran - V5.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "White",
      },
      {
        question: "What is your favorite food?",
        answer: "Soup",
      },
    ],
  },
  {
    id: "3",
    name: "Rafi",
    role: "Developer",
    bio: "Rafi is a developer",
    video: "/team/Rafi - V5.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Black",
      },
      {
        question: "What is your favorite food?",
        answer: "Rice",
      },
    ],
  },
  {
    id: "4",
    name: "Ross",
    role: "Designer",
    bio: "Ross is a designer",
    video: "/team/Ross - V5.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Gray",
      },
      {
        question: "What is your favorite food?",
        answer: "Steak",
      },
    ],
  },
];

function PersonInfo({
  person,
  isExpanded,
  onToggle,
}: {
  person: (typeof people)[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      layoutId="person-container"
      onClick={onToggle}
      className="mx-auto flex w-[344px] cursor-pointer flex-col items-center justify-between gap-2 overflow-hidden border border-black/5 bg-white/50 p-4 backdrop-blur-xl"
      style={{ borderRadius: 16 }}
    >
      <AnimatePresence mode="popLayout">
        {isExpanded ? (
          <motion.div
            layoutId={person.name}
            className="flex gap-2 text-stone-500"
          >
            <div className="flex gap-1">
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
                className="whitespace-nowrap text-stone-500"
              >
                {person.role}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layoutId={person.name}
            className="flex w-full items-center justify-between text-[14px] font-[450] leading-[24px] text-black"
          >
            <div className="flex flex-col">
              <motion.div
                key={person.name}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-black/60"
              >
                {person.name}
              </motion.div>
              <motion.div
                key={person.role}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-black/40"
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
              <ExpandIcon className="h-4 w-4 opacity-40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {isExpanded && (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
            layout="position"
          >
            <p className="px-8 text-center text-base font-[450] leading-[28px] text-black/50">
              {person.bio}
            </p>
            <div className="flex items-start gap-1 self-stretch">
              {person.info.map((info, index) => (
                <div
                  key={index}
                  className="flex h-[150px] w-[150px] flex-1 flex-col items-center justify-center rounded-2xl bg-black/[0.03] px-5 py-10"
                >
                  <div className="text-center text-[14px] font-[350] leading-[24px] text-black/40">
                    {info.question}
                  </div>
                  <div className="text-[20px] font-[450] leading-[32px] text-black/60">
                    {info.answer}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AboutPage() {
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
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {people.map((person, i) => (
              <motion.div
                key={person.id}
                className="relative flex h-full w-full flex-none items-center justify-center mix-blend-multiply"
                style={{ flex: "0 0 33%" }}
                initial={{
                  scale: 0.8,
                  filter: "blur(8px)",
                  opacity: 0,
                }}
                animate={{
                  scale: selectedIndex === i ? 1 : 0.8,
                  filter: selectedIndex === i ? "blur(0px)" : "blur(8px)",
                  opacity: isLoaded ? (selectedIndex === i ? 1 : 0.5) : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: isLoaded ? 0 : 0.2,
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-[70vh] object-contain mix-blend-multiply"
                >
                  <source src={person.video} type="video/mp4" />
                </video>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navigation/Bio Card */}
      <div className="absolute bottom-8 z-10 flex w-full justify-center">
        <PersonInfo
          person={people[selectedIndex]}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
      </div>

      {/* Dots Navigation */}
      {!isExpanded && (
        <div className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2">
          <div className="flex gap-2">
            {people.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className="h-2 w-2 rounded-full bg-stone-900/20"
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
