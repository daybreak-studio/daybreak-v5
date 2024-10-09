import React, { useEffect, useState } from "react";
import { animate, motion, stagger } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "/public/logos/daybreak-icon.svg";
import Wordmark from "/public/logos/daybreak-wordmark.svg";
import { useVisit } from "@/contexts/VisitContext";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [shouldRunAnimation, setShouldRunAnimation] = useState(false);
  const { hasVisitedBefore, setHasVisitedBefore } = useVisit();
  const router = useRouter();
  const activePath = router.asPath;

  // Check if the user has visited before

  useEffect(() => {
    if (typeof window !== "undefined" && hasVisitedBefore === false) {
      setShouldRunAnimation(true);
      localStorage.setItem("hasVisited", "true");
      setHasVisitedBefore(true);
    }
  }, [hasVisitedBefore, setHasVisitedBefore]);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const hasVisited = localStorage.getItem("hasVisited");
  //     if (!hasVisited) {
  //       setShouldRunAnimation(true);
  //       setHasVisitedBefore(false);
  //     } else {
  //       setHasVisitedBefore(true);
  //     }
  //   }
  // }, []); // Empty dependency array to run once on mount

  // Run the animation sequence if needed
  useEffect(() => {
    if (shouldRunAnimation) {
      const runAnimationSequence = async () => {
        await animate([
          [
            ".container",
            { opacity: 1 },
            { duration: 1, ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".glyph",
            { rotate: 0 },
            { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".glyph_container",
            { x: "0%" },
            { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".wordmark",
            { x: 0, opacity: 1, marginTop: "1px" },
            { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
          ],
        ]);
        await animate([
          [
            ".logo_container",
            { width: "5rem" },
            { duration: 1, at: "0", ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".parent",
            { transform: "0" },
            { duration: 1, ease: [0.76, 0, 0.24, 1], at: "<" },
          ],
        ]);
        await animate([
          [
            ".items",
            { width: "auto", opacity: 1 },
            { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".container",
            { backgroundColor: "rgb(255,255,255,0.5)" },
            { duration: 0.5, ease: [0.76, 0, 0.24, 1], at: "<" },
          ],
          [
            ".items > *",
            { opacity: 1 },
            {
              duration: 0.25,
              at: "<",
              delay: stagger(0.1),
              ease: [0.76, 0, 0.24, 1],
            },
          ],
        ]);
        await animate(
          ".pill",
          { opacity: 1 },
          { duration: 1, ease: [0.76, 0, 0.24, 1] },
        );
        await animate(
          ".container",
          { "--shadow-opacity": 1 },
          { duration: 1, ease: [0.76, 0, 0.24, 1] },
        );

        // Set the flag in localStorage
        localStorage.setItem("hasVisited", "true");
      };
      runAnimationSequence();
    }
  }, [shouldRunAnimation]);

  // If `hasVisitedBefore` is `null`, don't render anything
  if (hasVisitedBefore === null) {
    return null; // Or a loading indicator if preferred
  }

  return (
    <motion.nav
      className="parent fixed z-50 mx-auto flex h-fit w-full items-center justify-center"
      initial={{
        transform: hasVisitedBefore ? "translateY(0)" : "translateY(50vh)",
      }}
    >
      <motion.div
        className="container relative mt-4 flex w-fit items-stretch justify-center rounded-2xl p-1"
        initial={{
          opacity: hasVisitedBefore ? 1 : 0,
          backgroundColor: hasVisitedBefore
            ? "rgb(248,248,248,0.75)"
            : "rgb(255,255,255,0)",
        }}
      >
        {tabs.map((tab) =>
          tab.href === "/" ? (
            <Link
              key={tab.href}
              href="/"
              className="relative flex items-stretch"
            >
              <motion.div
                className="logo_container align-center relative mx-4 flex rounded-xl"
                initial={{
                  width: hasVisitedBefore ? "5rem" : "16rem",
                }}
              >
                <motion.div
                  className="glyph_container z-10 flex items-center overflow-hidden"
                  initial={{
                    width: "25%",
                    x: hasVisitedBefore ? "0%" : "200%",
                  }}
                >
                  <motion.div
                    className="glyph h-full w-full origin-bottom pb-1"
                    initial={{ rotate: hasVisitedBefore ? 0 : 180 }}
                  >
                    <Logo className="h-full w-full fill-current text-zinc-500" />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="wordmark_container z-10 flex items-center overflow-hidden pl-[6%]"
                  initial={{ width: "75%" }}
                >
                  <motion.div
                    className="wordmark h-full w-full"
                    initial={{
                      x: hasVisitedBefore ? "0%" : "100%",
                      opacity: hasVisitedBefore ? 1 : 0,
                    }}
                  >
                    <Wordmark className="h-full w-full fill-current text-zinc-500" />
                  </motion.div>
                </motion.div>
              </motion.div>
              {activePath === tab.href && (
                <Pill hasVisitedBefore={hasVisitedBefore} />
              )}
            </Link>
          ) : null,
        )}
        <motion.div
          className="items flex"
          initial={{
            opacity: hasVisitedBefore ? 1 : 0,
            width: hasVisitedBefore ? "auto" : 0,
          }}
        >
          {tabs.map((tab) =>
            tab.href !== "/" ? (
              <motion.h1
                key={tab.label}
                initial={{ opacity: hasVisitedBefore ? 1 : 0 }}
                className="relative px-4 py-3 text-xs text-zinc-500"
              >
                <Link href={tab.href} className="0 relative z-10">
                  {tab.label}
                </Link>
                {activePath === tab.href && (
                  <Pill hasVisitedBefore={hasVisitedBefore} />
                )}
              </motion.h1>
            ) : null,
          )}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}

const Pill = ({ hasVisitedBefore }: { hasVisitedBefore: boolean | null }) => {
  return (
    <motion.span
      layoutId="pill"
      className="pill absolute inset-0 z-0 bg-white"
      style={{ borderRadius: "12px" }}
      initial={{ opacity: hasVisitedBefore ? 1 : 0 }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.6,
      }}
    />
  );
};
