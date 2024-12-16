"use client";

import React, { use, useCallback, useEffect, useRef } from "react";
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./embla-carousel-arrow-buttons";
import { DotButton, useDotButton } from "./embla-carousel-dot-button";
import { cn } from "@/lib/utils";
import { relative } from "path";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { ExpandIcon } from "lucide-react";

const TWEEN_SCALE_FACTOR_BASE = 0.2;
const TWEEN_OPACITY_FACTOR_BASE = 0.0;
const TWEEN_BLUR_FACTOR_BASE = 8;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

interface Person {
  id: string;
  name: string;
  role: string;
  bio: string;
  info: [
    {
      question: string;
      answer: string;
    },
    {
      question: string;
      answer: string;
    },
  ];
  video: string;
}

type PropType = {
  people: Person[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { people, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const scaleTweenFactor = useRef(0);
  const opacityTweenFactor = useRef(0);
  const blurTweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number") as HTMLElement;
    });
  }, []);

  const setScaleTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    scaleTweenFactor.current =
      TWEEN_SCALE_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const setOpacityTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    opacityTweenFactor.current =
      TWEEN_OPACITY_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const setBlurTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    blurTweenFactor.current =
      TWEEN_BLUR_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue =
            1 - Math.abs(diffToTarget * scaleTweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          tweenNode.style.transform = `scale(${scale})`;
        });
      });
    },
    [],
  );

  const tweenOpacity = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue =
            1 - Math.abs(diffToTarget * opacityTweenFactor.current);
          const opacity = numberWithinRange(tweenValue, 0, 1).toString();
          emblaApi.slideNodes()[slideIndex].style.opacity = opacity;
        });
      });
    },
    [],
  );

  const tweenBlur = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = Math.abs(diffToTarget * blurTweenFactor.current);
          const blur = numberWithinRange(tweenValue, 0, 24).toString();
          emblaApi.slideNodes()[slideIndex].style.filter = `blur(${blur}px)`;
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setScaleTweenFactor(emblaApi);
    setOpacityTweenFactor(emblaApi);
    setBlurTweenFactor(emblaApi);
    tweenScale(emblaApi);
    tweenOpacity(emblaApi);
    tweenBlur(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setScaleTweenFactor)
      .on("reInit", setOpacityTweenFactor)
      .on("reInit", setBlurTweenFactor)
      .on("reInit", tweenScale)
      .on("reInit", tweenOpacity)
      .on("reInit", tweenBlur)
      .on("slideFocus", tweenScale)
      .on("slideFocus", tweenOpacity)
      .on("slideFocus", tweenBlur)
      .on("scroll", tweenScale)
      .on("scroll", tweenOpacity)
      .on("scroll", tweenBlur);
  }, [
    emblaApi,
    tweenScale,
    tweenOpacity,
    setTweenNodes,
    setScaleTweenFactor,
    setOpacityTweenFactor,
    setBlurTweenFactor,
    tweenBlur,
  ]);

  const [open, setOpen] = React.useState(true);

  return (
    <React.Fragment>
      <div className="embla">
        <div className="gradient" />
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {people.map((person) => (
              <div className={cn("embla__slide")} key={person.id}>
                <div className={cn("embla__slide__number", "relative")}>
                  <video
                    autoPlay
                    muted
                    loop
                    className="h-full w-fit object-cover mix-blend-multiply"
                  >
                    <source src={person.video} type="video/mp4" />
                  </video>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 z-10 flex w-screen items-center">
        <div className="relative flex w-full items-center justify-around">
          <AnimatePresence mode="popLayout">
            {!open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-24"
              >
                <EmblaCarouselDots
                  emblaApi={emblaApi}
                  onDotButtonClick={onDotButtonClick}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            layoutRoot
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "absolute bottom-0 transform cursor-pointer",
              // isMobile : ""
            )}
          >
            <EmblaCarouselBio person={people[selectedIndex]} open={open} />
          </motion.div>
        </div>
      </div>
    </React.Fragment>
  );
};

interface EmblaCarouselBioProps {
  person: Person;
  open: boolean;
}

const EmblaCarouselBio: React.FC<EmblaCarouselBioProps> = (props) => {
  const { person, open } = props;

  return (
    <motion.div
      layout
      layoutId="person-container"
      className="flex w-[344px] cursor-pointer flex-col items-center justify-between gap-2 overflow-hidden border border-black/5 bg-white/50 p-4 align-middle backdrop-blur-xl"
      style={{
        borderRadius: "16px",
      }}
    >
      <AnimatePresence mode="popLayout">
        {open ? (
          <motion.div
            layoutId={person.name}
            className="flex gap-2 text-[length:var(--Spacing-35,14px)] font-[450] not-italic leading-[var(--Spacing-6,24px)] text-[color(display-p3_0_0_0)] text-black"
          >
            <div className="flex gap-1">
              <motion.div
                key={person.name}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-black opacity-60"
              >
                {person.name}
              </motion.div>
              <motion.div
                key={person.role}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-black opacity-40"
              >
                {person.role}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layoutId={person.name}
            className="flex w-full items-center justify-between text-[length:var(--Spacing-35,14px)] font-[450] not-italic leading-[var(--Spacing-6,24px)] text-[color(display-p3_0_0_0)] text-black"
          >
            <div className="flex flex-col">
              <motion.div
                key={person.name}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-black opacity-60"
              >
                {person.name}
              </motion.div>
              <motion.div
                key={person.role}
                initial={{ filter: "blur(2px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(2px)" }}
                layout="position"
                className="whitespace-nowrap text-black opacity-40"
              >
                {person.role}
              </motion.div>
            </div>
            <motion.div
              key={"state: " + open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ExpandIcon className="mr-2 h-4 w-4 opacity-40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
            layout="position"
          >
            <div className="px-8 text-center text-base font-[450] not-italic leading-[var(--Spacing-7,28px)] text-[color(display-p3_0_0_0)] text-black opacity-50">
              {person.bio}
            </div>
            <div className="flex items-start gap-1 self-stretch">
              {person.info.map((info, index) => (
                <div
                  key={index}
                  className="flex h-[150px] w-[150px] flex-[1_0_0] flex-col items-center justify-center rounded-2xl bg-black/[0.03] px-5 py-10"
                >
                  <div className="text-center text-[length:var(--Spacing-35,14px)] font-[350] not-italic leading-[var(--Spacing-6,24px)] text-[color(display-p3_0_0_0)] text-black opacity-40">
                    {info.question}
                  </div>
                  <div className="text-[length:var(--Spacing-5,20px)] font-[450] not-italic leading-[var(--Spacing-8,32px)] text-[color(display-p3_0_0_0)] text-black opacity-60">
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
};

interface EmblaCarouselDotsProps {
  emblaApi: EmblaCarouselType | undefined;
  onDotButtonClick: (index: number) => void;
}

const EmblaCarouselDots: React.FC<EmblaCarouselDotsProps> = (props) => {
  const { emblaApi, onDotButtonClick } = props;
  const { selectedIndex, scrollSnaps } = useDotButton(emblaApi);

  return (
    <div className="inline-flex items-center gap-2">
      {scrollSnaps.map((_, index) => (
        <DotButton
          key={index}
          onClick={() => onDotButtonClick(index)}
          className={cn(
            "h-2 w-2 rounded-full bg-[color(display-p3_0_0_0)] opacity-20",
            "mr-2",
            index === selectedIndex && "scale-150 opacity-100",
          )}
        />
      ))}
    </div>
  );
};

export default EmblaCarousel;
